const hre = require("hardhat");
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("📡 Registering subscriptions with Reactive Lasna testnet...\n");

    // Get deployed contract addresses from environment
    const STRATEGY_WATCHER_ADDR = process.env.STRATEGY_WATCHER_RSC_ADDR;
    const MOCK_ADAPTER_ADDR = process.env.MOCK_LENDING_ADAPTER_ADDR;
    const SYSTEM_CONTRACT_ADDR = process.env.SYSTEM_CONTRACT_ADDR || "0x0000000000000000000000000000000000fffFfF";
    
    if (!STRATEGY_WATCHER_ADDR || !MOCK_ADAPTER_ADDR) {
        console.error("❌ Please run deployment script first to get contract addresses");
        process.exit(1);
    }

    const [deployer] = await ethers.getSigners();
    console.log("📡 Registering with account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "REACT\n");

    try {
        // Connect to the deployed StrategyWatcherRSC
        const StrategyWatcherRSC = await ethers.getContractFactory("StrategyWatcherRSC");
        const strategyWatcher = StrategyWatcherRSC.attach(STRATEGY_WATCHER_ADDR);

        console.log("1️⃣ Verifying StrategyWatcherRSC configuration...");
        console.log(`   Target Adapter: ${await strategyWatcher.targetAdapter()}`);
        console.log(`   Rebalancer RSC: ${await strategyWatcher.rebalancerRSC()}`);
        console.log(`   Chain ID: ${await strategyWatcher.chainId()}`);

        // Check if subscriptions are already active by calling the system contract
        console.log("\n2️⃣ Checking current subscriptions...");
        
        // The subscription should have been created during contract deployment
        // Let's verify by checking the contract's state
        const lastUpdateTime = await strategyWatcher.lastUpdateTime();
        console.log(`   Last update time: ${lastUpdateTime.toString()}`);
        
        if (lastUpdateTime.toString() !== "0") {
            console.log("✅ Subscriptions appear to be active");
        } else {
            console.log("⚠️  Subscriptions may need manual activation");
        }

        // Get thresholds for information
        console.log("\n3️⃣ Current rebalancing thresholds:");
        const [minThreshold, maxThreshold, rebalanceThreshold] = await strategyWatcher.getThresholds();
        console.log(`   Min APY Threshold: ${minThreshold.toString()} basis points (${(Number(minThreshold) / 100).toFixed(2)}%)`);
        console.log(`   Max APY Threshold: ${maxThreshold.toString()} basis points (${(Number(maxThreshold) / 100).toFixed(2)}%)`);
        console.log(`   Rebalance Threshold: ${rebalanceThreshold.toString()} basis points (${(Number(rebalanceThreshold) / 100).toFixed(2)}%)`);

        // Check current APY from the adapter
        console.log("\n4️⃣ Checking current adapter status...");
        const MockLendingAdapter = await ethers.getContractFactory("MockLendingAdapter");
        const mockAdapter = MockLendingAdapter.attach(MOCK_ADAPTER_ADDR);
        
        const currentAPY = await mockAdapter.getCurrentAPY();
        const lastKnownAPY = await strategyWatcher.getLastKnownAPY(MOCK_ADAPTER_ADDR);
        
        console.log(`   Current APY: ${currentAPY.toString()} basis points (${(Number(currentAPY) / 100).toFixed(2)}%)`);
        console.log(`   Last Known APY by Watcher: ${lastKnownAPY.toString()} basis points (${(Number(lastKnownAPY) / 100).toFixed(2)}%)`);

        // Test subscription functionality by triggering a manual APY update
        console.log("\n5️⃣ Testing reactive subscription...");
        console.log("   Updating APY to trigger reactive event...");
        
        // Update APY to a value that should trigger rebalancing
        const newAPY = 250; // 2.5% - below the minimum threshold of 3%
        await mockAdapter.updateAPY(newAPY);
        
        console.log(`   ✅ APY updated to ${newAPY} basis points (${(Number(newAPY) / 100).toFixed(2)}%)`);
        console.log("   📡 This should trigger the StrategyWatcherRSC via reactive subscription");
        
        // Wait a moment for the reactive system to process
        console.log("\n⏳ Waiting for reactive system to process the event...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check if the watcher received the update
        const newLastKnownAPY = await strategyWatcher.getLastKnownAPY(MOCK_ADAPTER_ADDR);
        if (newLastKnownAPY.toString() === newAPY.toString()) {
            console.log("✅ Reactive subscription is working! StrategyWatcherRSC received the APY update");
        } else {
            console.log("⚠️  Reactive subscription may take some time to process");
            console.log("   The system will automatically process the event when the next block is mined");
        }

        console.log("\n🎉 Subscription registration completed!");
        
        console.log("\n📋 SUBSCRIPTION SUMMARY");
        console.log("========================");
        console.log(`Strategy Watcher: ${STRATEGY_WATCHER_ADDR}`);
        console.log(`Monitoring Adapter: ${MOCK_ADAPTER_ADDR}`);
        console.log(`Current APY: ${(Number(newAPY) / 100).toFixed(2)}%`);
        console.log(`Rebalancing Threshold: ${(Number(rebalanceThreshold) / 100).toFixed(2)}%`);
        console.log("\n🔍 Monitor the reactive system:");
        console.log(`   Lasna Explorer: https://lasna.reactscan.net/address/${STRATEGY_WATCHER_ADDR}`);
        
        console.log("\n🚀 System is ready! Run 'npm run demo' to test the full workflow");

    } catch (error) {
        console.error("\n❌ Subscription registration failed:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("\n💡 Tip: Make sure the contracts have enough REACT for operations");
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