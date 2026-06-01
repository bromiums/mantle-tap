## Context

MonTap was built in a single sprint for the Monad Blitz Jogja hackathon. Chain-specific configuration is spread across six layers: `fe/src/config/chains.ts`, `fe/src/app/providers.tsx`, five separate backend service files each defining their own inline `MONAD_TESTNET` constant, `sc/foundry.toml`, two `.env.example` files, and the README. There is no shared chain config module in the backend — each service file duplicates the chain object.

Mantle Sepolia Testnet details:
- Chain ID: `5003`
- RPC: `https://rpc.sepolia.mantle.xyz`
- Native currency: `MNT` (18 decimals)
- Block explorer: `https://explorer.sepolia.mantle.xyz`
- Pyth oracle: `0xA2aa501b19aff244D90cc15a4Cf739D2725B5729` (same address works on Mantle Sepolia — verify before deploy)

## Goals / Non-Goals

**Goals:**
- All chain references point to Mantle Sepolia Testnet
- App is fully functional on Mantle after redeployment of contracts
- Backend services share a single chain definition (refactor the duplicated inline constants)
- Env example files accurately reflect Mantle RPC and contract addresses
- README reflects Mantle branding and removes Monad-specific feature claims

**Non-Goals:**
- Supporting both Monad and Mantle simultaneously (multi-chain is out of scope)
- Migrating existing on-chain state (Monad bets are abandoned; fresh deploy on Mantle)
- Changing smart contract logic — only deployment targets and configuration change
- Upgrading dependencies or refactoring unrelated code

## Decisions

### 1. Target Mantle Sepolia (not Mainnet)

Mantle Sepolia (5003) is the appropriate testnet for a hackathon submission. Mantle Mainnet (5000) would require real MNT for gas and is unnecessary for a competition demo.

*Alternative considered*: Mantle Mainnet — rejected because it requires funded wallets and is inappropriate for a hackathon prototype.

### 2. Consolidate backend chain constant into a shared module

Five backend files (`Settler.ts`, `ExpiryCleanup.ts`, `BetScanner.ts`, `bets.ts`, `session.ts`) each duplicate the same chain object. As part of this migration, extract a single `MANTLE_SEPOLIA` constant into `be/src/config/chain.ts` and import it everywhere.

*Alternative considered*: Just do a find-replace in each file — rejected because it perpetuates the duplication and makes future chain changes harder.

### 3. Remove MON price feed; add MNT if feed exists

The Pyth feed ID `PYTH_MON_PRICE_ID` is Monad-native and has no meaning on Mantle. Remove it from the deploy script and backend config. If a `MNT/USD` Pyth feed exists at deploy time, add it; otherwise the BTC and ETH feeds are sufficient for the hackathon demo.

### 4. Keep Privy for Account Abstraction

Privy supports Mantle via `defineChain` with no additional configuration. The `defaultChain` and `supportedChains` in `providers.tsx` simply swap to `mantleSepolia`. No wallet provider changes needed.

## Risks / Trade-offs

- **Pyth oracle address on Mantle Sepolia unverified** → Confirm `0xA2aa501b19aff244D90cc15a4Cf739D2725B5729` is live before running Deploy.s.sol. Check Pyth docs or `https://docs.pyth.network/price-feeds/contract-addresses/evm`.
- **`evm_version = "cancun"` in foundry.toml** → Mantle Sepolia may not support Cancun opcodes (TLOAD/TSTORE). If compilation or deployment fails, downgrade to `paris` in `foundry.toml`. The TapX contracts don't use transient storage, so this is low risk.
- **Session key funding uses native token** → `session.ts` sends native token (was MON) to fund session keys for gas. After migration this becomes MNT. The amounts and logic remain the same; only the symbol in log messages changes.
- **"Parallel Multi Tap (Monad Exclusive)"** feature relied on Monad's parallel execution model → Mantle does not expose the same guarantee. The feature still works as sequential batching but the marketing copy must be updated to remove "Monad Exclusive".

## Migration Plan

1. Verify Pyth oracle address on Mantle Sepolia
2. Apply code changes (chain config, backend shared module, env examples, deploy scripts)
3. Deploy MockUSDC on Mantle Sepolia → note address
4. Run `Deploy.s.sol` targeting Mantle Sepolia → note all contract addresses
5. Fill in `.env` files for both `fe/` and `be/` with new addresses
6. Test locally: `npm run dev` (fe) + `npm run dev` (be), verify bet flow end-to-end
7. Update README with new deployed addresses

**Rollback**: Not applicable — old Monad contracts remain live but app will no longer point to them. Reverting the chain config is sufficient to restore Monad functionality if needed.
