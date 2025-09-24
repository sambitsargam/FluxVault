const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting FluxVault deployment on Lasna testnet...\n");

    const [deployer] = await ethers.getSigners();
    console.log("📦 Deploying with account:", deployer.address);
    
    const INITIAL_SUPPLY = ethers.parseEther("1000000");
    const INITIAL_APY = 500;
    const SYSTEM_CONTRACT_ADDR = "0x0000000000000000000000000000000000fffFfF";
    const CHAIN_ID = 5318007;
    
    let contracts = {};

    // 1. Deploy FluxToken
    console.log("1️⃣ Deploying FluxToken...");
    const FluxToken = await ethers.getContractFactory("FluxToken");
    const fluxToken = await FluxToken.deploy("FluxVault Test Token", "FLUX", INITIAL_SUPPLY);
    await fluxToken.waitForDeployment();
    contracts.fluxToken = await fluxToken.getAddress();
    console.log("✅ FluxToken:", contracts.fluxToken);

    // 2. Deploy MockLendingAdapter
    console.log("2️⃣ Deploying MockLendingAdapter...");
    const MockLendingAdapter = await ethers.getContractFactory("MockLendingAdapter");
    const mockAdapter = await MockLendingAdapter.deploy(contracts.fluxToken, INITIAL_APY);
    await mockAdapter.waitForDeployment();
    contracts.mockAdapter = await mockAdapter.getAddress();
    console.log("✅ MockLendingAdapter:", contracts.mockAdapter);

    // 3. Deploy OriginVault
    console.log("3️⃣ Deploying OriginVault...");
    const OriginVault = await ethers.getContractFactory("OriginVault");
    const originVault = await OriginVault.deploy(contracts.fluxToken, "FluxVault Share", "fxFLUX");
    await originVault.waitForDeployment();
    contracts.originVault = await originVault.getAddress();
    console.log("✅ OriginVault:", contracts.originVault);

    // 4. Deploy RebalancerRSC
    console.log("4️⃣ Deploying RebalancerRSC...");
    const RebalancerRSC = await ethers.getContractFactory("RebalancerRSC");
    const rebalancerRSC = await RebalancerRSC.deploy(SYSTEM_CONTRACT_ADDR);
    await rebalancerRSC.waitForDeployment();
    contracts.rebalancerRSC = await rebalancerRSC.getAddress();
    console.log("✅ RebalancerRSC:", contracts.rebalancerRSC);

    // 5. Deploy StrategyWatcherRSC
    console.log("5️⃣ Deploying StrategyWatcherRSC...");
    const StrategyWatcherRSC = await ethers.getContractFactory("StrategyWatcherRSC");
    const strategyWatcherRSC = await StrategyWatcherRSC.deploy(contracts.mockAdapter, contracts.rebalancerRSC, CHAIN_ID);
    await strategyWatcherRSC.waitForDeployment();
    contracts.strategyWatcherRSC = await strategyWatcherRSC.getAddress();
    console.log("✅ StrategyWatcherRSC:", contracts.strategyWatcherRSC);

    // Save addresses
    const fs = require('fs');
    const addresses = {
        network: "lasna",
        contracts: contracts,
        deployer: deployer.address
    };
    fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
    
    console.log("\n🎉 Deployment completed!");
    console.log("📝 Addresses saved to deployed-addresses.json");
}

main().catch(console.error);
