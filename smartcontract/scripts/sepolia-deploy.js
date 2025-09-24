const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🌉 Deploying FluxVault Origin Chain Components to Sepolia...\n");

    const [deployer] = await ethers.getSigners();
    console.log("📦 Deploying with account:", deployer.address);
    
    // Get balance on Sepolia
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "SEP ETH\n");

    if (balance < ethers.parseEther("0.01")) {
        console.log("⚠️ Warning: Low balance, get more Sepolia ETH from faucet");
        console.log("   Sepolia Faucet: https://sepoliafaucet.com/\n");
    }

    const INITIAL_SUPPLY = ethers.parseEther("1000000");
    let contracts = {};

    try {
        // 1. Deploy FluxToken on Sepolia (for cross-chain bridging)
        console.log("1️⃣ Deploying FluxToken on Sepolia...");
        const FluxToken = await ethers.getContractFactory("FluxToken");
        const fluxToken = await FluxToken.deploy("FluxVault Token Sepolia", "FLUX", INITIAL_SUPPLY);
        await fluxToken.waitForDeployment();
        contracts.fluxTokenSepolia = await fluxToken.getAddress();
        console.log("✅ FluxToken (Sepolia):", contracts.fluxTokenSepolia);

        // 2. Deploy OriginVault on Sepolia
        console.log("2️⃣ Deploying OriginVault on Sepolia...");
        const OriginVault = await ethers.getContractFactory("OriginVault");
        const originVault = await OriginVault.deploy(
            contracts.fluxTokenSepolia, 
            "FluxVault Sepolia Shares", 
            "fxFLUX-SEP"
        );
        await originVault.waitForDeployment();
        contracts.originVaultSepolia = await originVault.getAddress();
        console.log("✅ OriginVault (Sepolia):", contracts.originVaultSepolia);

        // 3. Create a real lending adapter for Aave on Sepolia (placeholder for now)
        console.log("3️⃣ Deploying Aave Adapter Placeholder on Sepolia...");
        // For now, use MockLendingAdapter, but this would connect to real Aave
        const MockLendingAdapter = await ethers.getContractFactory("MockLendingAdapter");
        const aaveAdapter = await MockLendingAdapter.deploy(contracts.fluxTokenSepolia, 400); // 4% APY
        await aaveAdapter.waitForDeployment();
        contracts.aaveAdapterSepolia = await aaveAdapter.getAddress();
        console.log("✅ Aave Adapter (Sepolia):", contracts.aaveAdapterSepolia);

        // 4. Mint some test tokens for demo
        console.log("4️⃣ Minting test tokens...");
        await fluxToken.mint(deployer.address, ethers.parseEther("50000"));
        console.log("✅ Minted 50,000 FLUX tokens to deployer");

        // Save addresses for cross-chain reference
        const fs = require('fs');
        
        // Load existing addresses if they exist
        let allAddresses = {};
        try {
            const existingAddresses = fs.readFileSync('./deployed-addresses.json', 'utf8');
            allAddresses = JSON.parse(existingAddresses);
        } catch (error) {
            // File doesn't exist, start fresh
            allAddresses = {};
        }

        // Add Sepolia contracts
        allAddresses.sepolia = {
            network: "sepolia",
            chainId: 11155111,
            contracts: contracts,
            deployer: deployer.address,
            deployedAt: new Date().toISOString()
        };

        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(allAddresses, null, 2));
        
        console.log("\n🎉 Sepolia deployment completed!");
        console.log("📝 Addresses saved to deployed-addresses.json");
        
        console.log("\n📋 SEPOLIA DEPLOYMENT SUMMARY");
        console.log("=============================");
        console.log(`FluxToken (Sepolia):    ${contracts.fluxTokenSepolia}`);
        console.log(`OriginVault (Sepolia):  ${contracts.originVaultSepolia}`);
        console.log(`Aave Adapter (Sepolia): ${contracts.aaveAdapterSepolia}`);
        
        console.log("\n🔗 Cross-Chain Status:");
        console.log("✅ Lasna (Reactive): StrategyWatcher + Rebalancer deployed");  
        console.log("✅ Sepolia (Origin): OriginVault + Adapters deployed");
        console.log("🔄 Next: Configure cross-chain monitoring from Lasna RSCs");

    } catch (error) {
        console.error("\n❌ Sepolia deployment failed:", error.message);
        process.exit(1);
    }
}

main().catch(console.error);