import { createPublicClient, http, parseAbiItem, decodeEventLog } from 'viem';
import { Logger } from '../utils/Logger';
import { ActiveBet, Direction } from '../types';
import { config, TAP_BET_MANAGER_ABI, BYTES32_TO_SYMBOL } from '../config';
import { MANTLE_SEPOLIA } from '../config/chain';
import { broadcastWin } from '../server';

export class BetScanner {
  private logger = new Logger('BetScanner');
  private activeBets = new Map<bigint, ActiveBet>();
  private syncing = true;
  private client = createPublicClient({ chain: MANTLE_SEPOLIA, transport: http(config.rpcUrl), pollingInterval: 2000 });

  async start(): Promise<void> {
    this.syncing = true;
    await this._syncActiveBets();
    this._watchEvents();
    this.syncing = false;
    this.logger.info(`Startup sync complete — ${this.activeBets.size} active bets`);
  }

  getActiveBets(): Map<bigint, ActiveBet> {
    return this.activeBets;
  }

  removeBet(betId: bigint): void {
    this.activeBets.delete(betId);
  }

  isSyncing(): boolean {
    return this.syncing;
  }

  private async _syncActiveBets(): Promise<void> {
    const ids = await this.client.readContract({
      address: config.tapBetManager,
      abi: TAP_BET_MANAGER_ABI,
      functionName: 'getActiveBets',
    }) as bigint[];

    await Promise.all(ids.map(id => this._loadBet(id)));
  }

  private async _loadBet(betId: bigint): Promise<void> {
    try {
      const raw = await this.client.readContract({
        address: config.tapBetManager,
        abi: TAP_BET_MANAGER_ABI,
        functionName: 'getBet',
        args: [betId],
      }) as any;

      const symbolName = BYTES32_TO_SYMBOL[raw.symbol] ?? raw.symbol;
      const bet: ActiveBet = {
        betId:       raw.betId,
        user:        raw.user,
        symbol:      raw.symbol,
        symbolName,
        targetPrice: raw.targetPrice,
        collateral:  raw.collateral,
        multiplier:  raw.multiplier,
        direction:   raw.direction === 0 ? 'UP' : 'DOWN',
        expiry:      raw.expiry,
        placedAt:    raw.placedAt,
      };

      if (raw.status === 0) { // ACTIVE
        this.activeBets.set(betId, bet);
      }
    } catch (err) {
      this.logger.error(`Failed to load bet ${betId}`, err);
    }
  }

  private _watchEvents(): void {
    // Mantle Sepolia RPC doesn't support eth_newFilter — use getLogs polling instead
    let fromBlock: bigint | undefined;

    const poll = async () => {
      try {
        const latest = await this.client.getBlockNumber();

        if (fromBlock === undefined) {
          fromBlock = latest;
          return;
        }

        if (latest < fromBlock) return;

        const logs = await this.client.getLogs({
          address: config.tapBetManager,
          events: TAP_BET_MANAGER_ABI.filter((x): x is (typeof TAP_BET_MANAGER_ABI)[number] & { type: 'event' } => x.type === 'event'),
          fromBlock,
          toBlock: latest,
        });

        for (const log of logs) {
          try {
            const { eventName, args } = decodeEventLog({ abi: TAP_BET_MANAGER_ABI, data: log.data, topics: log.topics as any }) as any;

            if (eventName === 'BetPlaced') {
              const symbolName = BYTES32_TO_SYMBOL[args.symbol] ?? args.symbol;
              const bet: ActiveBet = {
                betId:       args.betId,
                user:        args.user,
                symbol:      args.symbol,
                symbolName,
                targetPrice: args.targetPrice,
                collateral:  args.collateral,
                multiplier:  args.multiplier,
                direction:   args.direction === 0 ? 'UP' : 'DOWN',
                expiry:      args.expiry,
                placedAt:    BigInt(Math.floor(Date.now() / 1000)),
              };
              this.activeBets.set(args.betId, bet);
              this.logger.info(`Bet placed: id=${args.betId} ${symbolName} ${bet.direction} target=${args.targetPrice}`);
            } else if (eventName === 'BetWon') {
              this.activeBets.delete(args.betId);
              this.logger.info(`Bet won: id=${args.betId} settler=${args.settler} payout=${args.payout}`);
              broadcastWin(args.betId, args.user ?? args.settler, args.payout ?? 0n);
            } else if (eventName === 'BetExpired') {
              this.activeBets.delete(args.betId);
              this.logger.info(`Bet expired: id=${args.betId}`);
            }
          } catch { /* skip unrecognised log */ }
        }

        fromBlock = latest + 1n;
      } catch (err) {
        this.logger.error('Event poll error', err);
      }
    };

    setInterval(poll, 2000);
    poll();
  }
}
