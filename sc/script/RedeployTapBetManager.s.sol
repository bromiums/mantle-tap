// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/trading/TapBetManager.sol";
import "../src/treasury/TapVault.sol";

/**
 * @title RedeployTapBetManager
 * @notice Deploys a new TapBetManager (e.g. after adding placeBetsWithSessionSignature)
 *         and rewires it into the existing TapVault, reusing the already-deployed
 *         PriceAdapter, MultiplierEngine, TapVault, and USDC — so vault liquidity and
 *         other infra are left untouched.
 * @dev Set env vars before running:
 *   TAP_VAULT          - existing TapVault address
 *   PRICE_ADAPTER      - existing PriceAdapter address
 *   MULTIPLIER_ENGINE  - existing MultiplierEngine address
 *   USDC_ADDRESS       - existing USDC address
 *   SETTLER_ADDRESS    - settler/solver address
 *   PRIVATE_KEY        - deployer private key (must be owner of TapVault)
 *
 * Run: forge script script/RedeployTapBetManager.s.sol --rpc-url mantle_sepolia --broadcast
 */
contract RedeployTapBetManager is Script {
    function run() external {
        address vaultAddress      = vm.envAddress("TAP_VAULT");
        address priceAdapter      = vm.envAddress("PRICE_ADAPTER");
        address multiplierEngine  = vm.envAddress("MULTIPLIER_ENGINE");
        address usdcAddress       = vm.envAddress("USDC_ADDRESS");
        address settlerAddress    = vm.envAddress("SETTLER_ADDRESS");

        TapVault vault = TapVault(vaultAddress);

        vm.startBroadcast();

        TapBetManager manager = new TapBetManager(
            vaultAddress,
            priceAdapter,
            multiplierEngine,
            usdcAddress
        );
        console.log("New TapBetManager:", address(manager));

        vault.setBetManager(address(manager));
        console.log("Vault betManager rewired to new TapBetManager");

        manager.setSettler(settlerAddress);
        console.log("Settler set to:", settlerAddress);

        vm.stopBroadcast();

        console.log("\n=== Redeploy Summary ===");
        console.log("TapVault (reused):        ", vaultAddress);
        console.log("PriceAdapter (reused):    ", priceAdapter);
        console.log("MultiplierEngine (reused):", multiplierEngine);
        console.log("New TapBetManager:        ", address(manager));
    }
}
