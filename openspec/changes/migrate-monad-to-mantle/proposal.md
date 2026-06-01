## Why

MonTap (TapX) was originally built for the Monad Blitz Jogja hackathon and deployed on Monad Testnet. The project is now being submitted to the Mantle Hackathon 2026, requiring a full chain migration — swapping every Monad-specific configuration, contract address, RPC, and branding reference to Mantle.

## What Changes

- Replace Monad Testnet chain config (chain ID 10143, RPC `testnet-rpc.monad.xyz`) with Mantle Sepolia Testnet (chain ID 5003, RPC `rpc.sepolia.mantle.xyz`)
- Replace native currency `MON` with `MNT` throughout frontend, backend, and contracts
- Update Pyth oracle contract address to the Mantle deployment
- Redeploy all smart contracts on Mantle Sepolia and update deployed addresses in env files and README
- Update `foundry.toml` RPC endpoints to include `mantle_sepolia`
- Update deploy script (`deploy.sh`) to target Mantle Sepolia
- Remove/rename `MON_PYTH_ID` price feed (Monad-native token) — replace with `MNT` feed if available, otherwise remove
- Update backend services (`Settler`, `BetScanner`, `ExpiryCleanup`, `bets` route, `session` route) which each define their own `MONAD_TESTNET` chain constant inline
- Update frontend providers (`providers.tsx`) and chain config (`chains.ts`) to reference Mantle
- Update all env example files (`sc/.env.example`, `be/.env.example`) with Mantle RPC and Pyth addresses
- Update README, branding copy, and feature descriptions (remove "Monad Exclusive" parallel execution feature callout; replace with Mantle-appropriate messaging)
- **BREAKING**: Contract addresses change — all existing on-chain bets on Monad are abandoned; new deployment on Mantle required before the app is functional

## Capabilities

### New Capabilities

- `mantle-chain-config`: Chain definitions, RPC endpoints, and native currency config for Mantle Sepolia — used across frontend, backend, and deploy tooling

### Modified Capabilities

<!-- No existing specs to modify — this is a greenfield OpenSpec setup -->

## Impact

- **Frontend** (`fe/src/config/chains.ts`, `fe/src/app/providers.tsx`): chain definition swap
- **Backend** (`be/src/routes/session.ts`, `be/src/routes/bets.ts`, `be/src/services/Settler.ts`, `be/src/services/ExpiryCleanup.ts`, `be/src/services/BetScanner.ts`): inline `MONAD_TESTNET` constant replaced with `MANTLE_SEPOLIA`
- **Smart contracts** (`sc/foundry.toml`, `sc/.env.example`, `sc/script/Deploy.s.sol`, `sc/deploy.sh`): RPC, Pyth address, and price ID updates
- **Env files**: All RPC URLs and Pyth contract addresses need updating
- **README.md**: All Monad references, deployed contract addresses, and hackathon branding updated
- No dependency version changes required — Wagmi/viem/Privy all support Mantle out of the box via `defineChain`
