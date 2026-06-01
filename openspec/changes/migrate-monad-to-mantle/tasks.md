## 1. Frontend Chain Config

- [x] 1.1 Replace `monadTestnet` definition in `fe/src/config/chains.ts` with `mantleSepolia` (chain ID 5003, RPC `https://rpc.sepolia.mantle.xyz`, native currency MNT, explorer `https://explorer.sepolia.mantle.xyz`)
- [x] 1.2 Update `fe/src/app/providers.tsx` — swap all `monadTestnet` references to `mantleSepolia` in Wagmi config, Privy `defaultChain`, and `supportedChains`

## 2. Backend Shared Chain Module

- [x] 2.1 Create `be/src/config/chain.ts` exporting a `MANTLE_SEPOLIA` chain constant (chain ID 5003, RPC from `process.env.RPC_URL`, MNT native currency)
- [x] 2.2 Replace inline `MONAD_TESTNET` constant in `be/src/services/Settler.ts` with import of `MANTLE_SEPOLIA`
- [x] 2.3 Replace inline `MONAD_TESTNET` constant in `be/src/services/ExpiryCleanup.ts` with import of `MANTLE_SEPOLIA`
- [x] 2.4 Replace inline `MONAD_TESTNET` constant in `be/src/services/BetScanner.ts` with import of `MANTLE_SEPOLIA`
- [x] 2.5 Replace inline `MONAD_TESTNET` constant in `be/src/routes/bets.ts` with import of `MANTLE_SEPOLIA`
- [x] 2.6 Replace inline `MONAD_TESTNET` constant and all MON references in `be/src/routes/session.ts` with `MANTLE_SEPOLIA` and MNT
- [x] 2.7 Update `be/src/types/index.ts` — change `symbol: 'MON'` to `symbol: 'MNT'` for native currency type
- [x] 2.8 Update `be/src/config.ts` — remove `MON` price ID key and mapping; update any MON-specific references to MNT

## 3. Smart Contract Tooling

- [x] 3.1 Add `mantle_sepolia = "https://rpc.sepolia.mantle.xyz"` to `[rpc_endpoints]` in `sc/foundry.toml`
- [x] 3.2 Update comment in `sc/script/Deploy.s.sol` — change run example from `--rpc-url monad_testnet` to `--rpc-url mantle_sepolia`; update `@notice` to say Mantle Sepolia
- [x] 3.3 Rename `MON_PYTH_ID` to `MNT_PYTH_ID` in `sc/script/Deploy.s.sol` and update the price ID registration from `keccak256("MON")` to `keccak256("MNT")`
- [x] 3.4 Update `sc/.env.example` — set `RPC_URL` to `https://rpc.sepolia.mantle.xyz`, update `PYTH_CONTRACT` to Mantle Sepolia Pyth address, replace `PYTH_MON_PRICE_ID` with `PYTH_MNT_PRICE_ID`

## 4. Backend Env Config

- [x] 4.1 Update `be/.env.example` — set `RPC_URL` to `https://rpc.sepolia.mantle.xyz`, replace `PYTH_MON_PRICE_ID` with `PYTH_MNT_PRICE_ID`

## 5. README and Branding

- [x] 5.1 Update `README.md` header and intro — replace "Monad" with "Mantle", update hackathon name to Mantle Hackathon 2026
- [x] 5.2 Update "Parallel Multi Tap" section in README — remove "(Monad Exclusive)" label and rewrite description without Monad-specific execution claims
- [x] 5.3 Update Architecture section in README — rename folder reference from `monad-blitz-jogja/` to project name, update blockchain row in tech stack table from "Monad Testnet" to "Mantle Sepolia Testnet"
- [x] 5.4 Clear deployed contract addresses table in README — replace Monad addresses with placeholder `TBD` (to be filled after Mantle deployment)
- [x] 5.5 Update backend env example section in README — change `RPC_URL` example from Monad to Mantle

## 6. Contract Deployment (after code changes)

- [ ] 6.1 Verify Pyth oracle contract address on Mantle Sepolia at `https://docs.pyth.network/price-feeds/contract-addresses/evm`
- [ ] 6.2 Deploy MockUSDC on Mantle Sepolia: `forge script script/DeployMockUSDC.s.sol --rpc-url mantle_sepolia --broadcast`
- [ ] 6.3 Run full deploy: `./deploy.sh` (with Mantle env vars set) and record all contract addresses
- [ ] 6.4 Fill deployed addresses into `fe/.env.local` and `be/.env` and update README deployed contracts table
