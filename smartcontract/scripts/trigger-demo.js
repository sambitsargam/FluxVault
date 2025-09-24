const hre = require("hardhat");
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🎬 Starting FluxVault Demo - Cross-Chain Yield Optimizer\n");

    // Get deployed contract addresses from environment
    const ORIGIN_VAULT_ADDR = process.env.ORIGIN_VAULT_ADDR;
    const MOCK_ADAPTER_ADDR = process.env.MOCK_LENDING_ADAPTER_ADDR;
    const STRATEGY_WATCHER_ADDR = process.env.STRATEGY_WATCHER_RSC_ADDR;
    const REBALANCER_ADDR = process.env.REBALANCER_RSC_ADDR;
    const FLUX_TOKEN_ADDR = process.env.FLUX_TOKEN_ADDR;
    
    if (!ORIGIN_VAULT_ADDR || !MOCK_ADAPTER_ADDR || !STRATEGY_WATCHER_ADDR || !REBALANCER_ADDR) {
        console.error("❌ Please run deployment script first to get contract addresses");
        process.exit(1);
    }

    const [deployer] = await ethers.getSigners();
    console.log("🎮 Running demo with account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "REACT\n");

    try {
        // Connect to deployed contracts
        const FluxToken = await ethers.getContractFactory("FluxToken");
        const OriginVault = await ethers.getContractFactory("OriginVault");
        const MockLendingAdapter = await ethers.getContractFactory("MockLendingAdapter");
        const StrategyWatcherRSC = await ethers.getContractFactory("StrategyWatcherRSC");
        const RebalancerRSC = await ethers.getContractFactory("RebalancerRSC");

        const fluxToken = FluxToken.attach(FLUX_TOKEN_ADDR);
        const originVault = OriginVault.attach(ORIGIN_VAULT_ADDR);
        const mockAdapter = MockLendingAdapter.attach(MOCK_ADAPTER_ADDR);
        const strategyWatcher = StrategyWatcherRSC.attach(STRATEGY_WATCHER_ADDR);
        const rebalancer = RebalancerRSC.attach(REBALANCER_ADDR);

        console.log("📊 INITIAL STATE");
        console.log("================");
        
        // Check initial balances and state
        const userTokenBalance = await fluxToken.balanceOf(deployer.address);
        const userVaultShares = await originVault.balanceOf(deployer.address);
        const vaultTotalAssets = await originVault.totalAssets();
        const currentAPY = await mockAdapter.getCurrentAPY();
        
        console.log(`User Token Balance: ${ethers.formatEther(userTokenBalance)} FLUX`);
        console.log(`User Vault Shares: ${ethers.formatEther(userVaultShares)} fFLUX`);
        console.log(`Vault Total Assets: ${ethers.formatEther(vaultTotalAssets)} FLUX`);
        console.log(`Current Adapter APY: ${(currentAPY / 100).toFixed(2)}%`);
        
        // Get rebalancing thresholds
        const [minThreshold, maxThreshold, rebalanceThreshold] = await strategyWatcher.getThresholds();
        console.log(`\nRebalancing Thresholds:`);
        console.log(`  Min APY: ${(minThreshold / 100).toFixed(2)}%`);
        console.log(`  Max APY: ${(maxThreshold / 100).toFixed(2)}%`);
        console.log(`  Rebalance Trigger: ${(rebalanceThreshold / 100).toFixed(2)}%`);

        // Step 1: User deposits more tokens
        console.log("\n1️⃣ USER DEPOSITS TEST TOKENS");
        console.log("==============================");
        
        const depositAmount = ethers.parseEther("500");
        console.log(`Depositing ${ethers.formatEther(depositAmount)} FLUX to vault...`);
        
        // Ensure user has enough tokens and approve vault
        await fluxToken.approve(ORIGIN_VAULT_ADDR, depositAmount);
        await originVault.deposit(depositAmount, deployer.address);
        
        const newUserShares = await originVault.balanceOf(deployer.address);
        const newVaultAssets = await originVault.totalAssets();
        
        console.log(`✅ Deposit successful!`);
        console.log(`   New User Shares: ${ethers.formatEther(newUserShares)} fFLUX`);
        console.log(`   New Vault Assets: ${ethers.formatEther(newVaultAssets)} FLUX`);

        // Step 2: Simulate market conditions - Update APY to trigger rebalancing
        console.log("\n2️⃣ MARKET CONDITIONS CHANGE - APY DROPS");
        console.log("=========================================");
        
        const newLowAPY = 150; // 1.5% - below minimum threshold
        console.log(`Current APY: ${(currentAPY / 100).toFixed(2)}%`);
        console.log(`Updating APY to: ${(newLowAPY / 100).toFixed(2)}% (below ${(minThreshold / 100).toFixed(2)}% threshold)`);
        
        // This should trigger the StrategyWatcherRSC
        const tx = await mockAdapter.updateAPY(newLowAPY);
        const receipt = await tx.wait();
        
        console.log(`✅ APY updated in transaction: ${receipt.hash}`);
        console.log(`📡 This event should trigger the Reactive subscription...`);
        
        // Wait for reactive system to process
        console.log("\n⏳ Waiting for Reactive Network to process the event...");
        await new Promise(resolve => setTimeout(resolve, 8000)); // Wait 8 seconds
        
        // Check if the StrategyWatcherRSC received the event
        const lastKnownAPY = await strategyWatcher.getLastKnownAPY(MOCK_ADAPTER_ADDR);
        console.log(`Strategy Watcher Last Known APY: ${(lastKnownAPY / 100).toFixed(2)}%`);
        
        if (lastKnownAPY.toString() === newLowAPY.toString()) {
            console.log("✅ Reactive subscription working! StrategyWatcherRSC detected the APY change");
        } else {
            console.log("⚠️  Reactive processing may still be in progress...");
        }

        // Step 3: Check if rebalancing would be triggered
        console.log("\n3️⃣ REBALANCING ANALYSIS");
        console.log("========================");
        
        const wouldTrigger = await strategyWatcher.wouldTriggerRebalancing(currentAPY, newLowAPY);
        console.log(`Would trigger rebalancing: ${wouldTrigger ? "✅ YES" : "❌ NO"}`);
        
        if (wouldTrigger) {
            console.log("🎯 Conditions met for rebalancing:");
            console.log(`   - APY dropped to ${(newLowAPY / 100).toFixed(2)}% (below ${(minThreshold / 100).toFixed(2)}% threshold)`);
            console.log(`   - Difference: ${((currentAPY - newLowAPY) / 100).toFixed(2)}% (above ${(rebalanceThreshold / 100).toFixed(2)}% trigger)`);
        }

        // Step 4: Test another APY change to show high yield scenario
        console.log("\n4️⃣ MARKET RECOVERS - HIGH YIELD OPPORTUNITY");
        console.log("===========================================");
        
        const newHighAPY = 1200; // 12% - above maximum threshold
        console.log(`Updating APY to: ${(newHighAPY / 100).toFixed(2)}% (above ${(maxThreshold / 100).toFixed(2)}% threshold)`);
        
        const tx2 = await mockAdapter.updateAPY(newHighAPY);
        const receipt2 = await tx2.wait();
        
        console.log(`✅ APY updated in transaction: ${receipt2.hash}`);
        console.log(`📡 This should also trigger reactive rebalancing...`);
        
        // Wait again
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const latestKnownAPY = await strategyWatcher.getLastKnownAPY(MOCK_ADAPTER_ADDR);
        console.log(`Latest Strategy Watcher APY: ${(latestKnownAPY / 100).toFixed(2)}%`);

        // Step 5: Demonstrate vault operations
        console.log("\n5️⃣ VAULT OPERATIONS DEMO");
        console.log("=========================");
        
        const finalAPY = await mockAdapter.getCurrentAPY();
        const finalVaultAssets = await originVault.totalAssets();
        const finalUserShares = await originVault.balanceOf(deployer.address);
        
        console.log(`Final APY: ${(finalAPY / 100).toFixed(2)}%`);
        console.log(`Vault Total Assets: ${ethers.formatEther(finalVaultAssets)} FLUX`);
        console.log(`User Shares: ${ethers.formatEther(finalUserShares)} fFLUX`);
        
        // Show withdrawal preview
        const withdrawShares = ethers.parseEther("100");
        const withdrawAssets = await originVault.convertToAssets(withdrawShares);
        console.log(`\nWithdrawal Preview:`);
        console.log(`  ${ethers.formatEther(withdrawShares)} fFLUX → ${ethers.formatEther(withdrawAssets)} FLUX`);

        // Step 6: Transaction hashes and summary
        console.log("\n6️⃣ TRANSACTION SUMMARY");
        console.log("======================");
        
        console.log(`Deployment completed: See deployment script output`);
        console.log(`APY Update 1 (Low): ${receipt.hash}`);
        console.log(`APY Update 2 (High): ${receipt2.hash}`);
        
        console.log("\n🎉 DEMO COMPLETED SUCCESSFULLY!");
        
        console.log("\n📋 FINAL STATE SUMMARY");
        console.log("=======================");
        console.log(`Vault Address: ${ORIGIN_VAULT_ADDR}`);
        console.log(`Strategy Watcher: ${STRATEGY_WATCHER_ADDR}`);
        console.log(`Rebalancer: ${REBALANCER_ADDR}`);
        console.log(`Current APY: ${(finalAPY / 100).toFixed(2)}%`);
        console.log(`Total Assets Under Management: ${ethers.formatEther(finalVaultAssets)} FLUX`);
        
        console.log("\n🔍 Monitor your contracts:");
        console.log(`Vault Explorer: https://lasna.reactscan.net/address/${ORIGIN_VAULT_ADDR}`);
        console.log(`Strategy Watcher: https://lasna.reactscan.net/address/${STRATEGY_WATCHER_ADDR}`);
        console.log(`Rebalancer: https://lasna.reactscan.net/address/${REBALANCER_ADDR}`);
        
        console.log("\n✨ The reactive system will continue monitoring APY changes automatically!");
        console.log("   Any future APY updates will trigger the StrategyWatcherRSC");
        console.log("   Which will evaluate rebalancing conditions and trigger RebalancerRSC if needed");

    } catch (error) {
        console.error("\n❌ Demo failed:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("\n💡 Tip: Make sure you have enough tokens and REACT for operations");
        }
        
        throw error;
    }
}

// Handle script execution
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = main;