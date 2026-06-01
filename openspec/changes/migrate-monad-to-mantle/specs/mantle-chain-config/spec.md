## ADDED Requirements

### Requirement: Frontend uses Mantle Sepolia chain definition
The frontend SHALL define Mantle Sepolia Testnet (chain ID 5003) as the sole supported chain, replacing the Monad Testnet definition. The chain object SHALL include the correct RPC URL, native currency (MNT), and block explorer.

#### Scenario: App loads with Mantle chain
- **WHEN** the frontend application initializes
- **THEN** Wagmi and Privy are configured with `mantleSepolia` (chain ID 5003) as `defaultChain` and the only entry in `supportedChains`

#### Scenario: Chain definition has correct parameters
- **WHEN** `fe/src/config/chains.ts` is imported
- **THEN** the exported chain object has `id: 5003`, `nativeCurrency.symbol: "MNT"`, and `rpcUrls.default.http` pointing to `https://rpc.sepolia.mantle.xyz`

### Requirement: Backend uses a shared Mantle Sepolia chain constant
The backend SHALL define the Mantle Sepolia chain object exactly once in `be/src/config/chain.ts`. All backend services and routes that need a chain object SHALL import from this shared module rather than defining inline chain objects.

#### Scenario: No duplicate chain definitions in backend
- **WHEN** the backend source is audited
- **THEN** there is exactly one definition of the chain ID 5003 object, located in `be/src/config/chain.ts`

#### Scenario: Services use shared chain constant
- **WHEN** `Settler.ts`, `ExpiryCleanup.ts`, `BetScanner.ts`, `bets.ts`, and `session.ts` are reviewed
- **THEN** none of them define an inline chain constant — all import `MANTLE_SEPOLIA` from `be/src/config/chain.ts`

### Requirement: Smart contract tooling targets Mantle Sepolia
The `sc/foundry.toml` SHALL include a `mantle_sepolia` RPC endpoint. The deploy script comment and instructions SHALL reference Mantle Sepolia as the target network.

#### Scenario: foundry.toml has Mantle RPC
- **WHEN** `sc/foundry.toml` is read
- **THEN** `[rpc_endpoints]` contains `mantle_sepolia = "https://rpc.sepolia.mantle.xyz"`

#### Scenario: Deploy command targets Mantle
- **WHEN** `sc/script/Deploy.s.sol` header comment is read
- **THEN** the example run command uses `--rpc-url mantle_sepolia` instead of `monad_testnet`

### Requirement: Environment example files reflect Mantle configuration
All `.env.example` files SHALL use Mantle Sepolia RPC URLs and Pyth oracle address. The `PYTH_MON_PRICE_ID` variable SHALL be removed and replaced with `PYTH_MNT_PRICE_ID` (left blank if feed unavailable).

#### Scenario: sc/.env.example uses Mantle RPC
- **WHEN** `sc/.env.example` is read
- **THEN** `RPC_URL` defaults to `https://rpc.sepolia.mantle.xyz` and `PYTH_CONTRACT` references the Mantle Pyth address

#### Scenario: be/.env.example uses Mantle RPC
- **WHEN** `be/.env.example` is read
- **THEN** `RPC_URL` is `https://rpc.sepolia.mantle.xyz` and `PYTH_MON_PRICE_ID` no longer appears

### Requirement: README and UI copy reference Mantle, not Monad
All user-facing text, documentation, and branding SHALL reference Mantle. References to "Monad Exclusive", "Monad Blitz Jogja", "Monad parallel execution", and `monad.xyz` SHALL be replaced or removed.

#### Scenario: README has no Monad branding
- **WHEN** `README.md` is read
- **THEN** it does not contain the words "Monad" or "monad.xyz" outside of a historical note

#### Scenario: Parallel Multi Tap feature copy is updated
- **WHEN** the frontend feature description for "Parallel Multi Tap" is read
- **THEN** it does not claim "Monad Exclusive" and describes the feature in Mantle-neutral terms
