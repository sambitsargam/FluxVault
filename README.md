# FluxVault - Cross-Chain Yield Optimizer

![FluxVault Logo](https://img.shields.io/badge/FluxVault-Cross--Chain%20DeFi-blue?style=for-the-badge)

## 🚀 Fully Working Prototype - Live on Testnets!

FluxVault is a revolutionary cross-chain yield optimization protocol that automatically maximizes returns across multiple blockchain networks using reactive smart contracts.

### ✨ **Key Features**

- **🔗 True Cross-Chain Architecture:** Real deployment across Sepolia and Reactive Lasna testnets
- **⚡ Automated Rebalancing:** Reactive contracts monitor and optimize yield strategies
- **🎯 ERC-4626 Compliance:** Standardized vault interface for maximum compatibility
- **🌐 Professional Web3 Frontend:** Complete user interface with wallet integration
- **🛡️ Production-Ready Security:** Comprehensive access controls and emergency features

---

## 🎯 **Live Deployment Status**

### **Smart Contracts (Testnet)**

#### **Sepolia Network (Origin Chain)**
- **OriginVault:** `0x4AB4a316B3D0fa0e17F1e7C28d48af6C27A61329`
- **FluxToken:** `[Deployed Address]`
- **Explorer:** [Sepolia Etherscan](https://sepolia.etherscan.io/)

#### **Reactive Lasna Network (Monitoring Chain)**
- **StrategyWatcherRSC:** `0x55e5B3A258d3F4f3a74883E34741DA0159093c2B`
- **RebalancerRSC:** `[Deployed Address]`
- **Explorer:** [Reactive Network Explorer](https://reactive.network/explorer/)

### **Frontend Application**
- **Technology:** Next.js 15.5.4, React 19, TypeScript, TailwindCSS
- **Web3 Stack:** Wagmi, Viem, ethers.js
- **Live Demo:** http://localhost:3000/dashboard

---

## 🏗️ **Architecture Overview**

### **Cross-Chain Flow**

```
User Deposits FLUX → Sepolia OriginVault → Reactive Lasna Monitoring
     ↓                                              ↓
User Withdraws with Profit ← Yield Maximization ← Strategy Optimization
```

### **Network Roles**

| Network | Purpose | Components |
|---------|---------|------------|
| **Sepolia** | Origin Chain | User deposits, withdrawals, main vault operations |
| **Reactive Lasna** | Monitoring Chain | Strategy watching, automatic rebalancing triggers |

---

## 🛠️ **Quick Start Guide**

### **Prerequisites**
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Sepolia ETH for gas fees
- FLUX tokens on Sepolia testnet

### **1. Clone and Setup**
```bash
git clone https://github.com/sambitsargam/FluxVault.git
cd FluxVault
```

### **2. Smart Contract Deployment**
```bash
cd smartcontract
npm install

# Deploy to Sepolia
npx hardhat run scripts/sepolia-deploy.js --network sepolia

# Deploy to Reactive Lasna
npx hardhat run scripts/lasna-deploy.js --network reactive
```

### **3. Frontend Development**
```bash
cd frontend
npm install
npm run dev
```

### **4. Access the Dashboard**
Open http://localhost:3000/dashboard in your browser

---

## 🌟 **User Experience**

### **Dashboard Features**

#### **🔐 Wallet Integration**
- Connect with MetaMask, WalletConnect
- Automatic network detection and switching
- Multi-chain balance display

#### **💰 Vault Operations**
- **Deposit:** Stake FLUX tokens to earn yield
- **Withdraw:** Redeem vault shares for underlying assets
- **Monitor:** Real-time APY tracking and portfolio value

#### **📊 Strategy Management**
- View total vault assets and current APY
- Monitor cross-chain contract activities
- Track transaction history and status

#### **🔗 Cross-Chain Visibility**
- Contract addresses with explorer links
- Network-specific UI indicators
- Real-time synchronization status

---

## 💻 **Technology Stack**

### **Smart Contracts**
- **Solidity:** Smart contract development
- **Hardhat:** Development framework
- **OpenZeppelin:** Security standards
- **ERC-4626:** Vault token standard

### **Frontend**
- **Next.js 15.5.4:** React framework
- **TypeScript:** Type-safe development
- **TailwindCSS:** Utility-first styling
- **Wagmi:** React hooks for Ethereum

### **Web3 Integration**
- **Viem:** Type-safe Ethereum library
- **ethers.js:** Blockchain interactions
- **Web3Modal:** Wallet connection

---

## 🔐 **Security Features**

### **Smart Contract Security**
- ✅ **Access Control:** Role-based permissions
- ✅ **Reentrancy Protection:** Safe external calls
- ✅ **Input Validation:** Parameter bounds checking
- ✅ **Emergency Controls:** Circuit breaker patterns
- ✅ **Audit Ready:** Professional security standards

### **Frontend Security**
- ✅ **Input Sanitization:** User input validation
- ✅ **Transaction Verification:** Contract address checking
- ✅ **Network Validation:** Chain ID verification
- ✅ **Error Boundaries:** Graceful failure handling

---

## 📖 **API Reference**

### **Core Contracts**

#### **OriginVault (Sepolia)**
```solidity
contract OriginVault is ERC4626, Ownable, ReentrancyGuard {
    function deposit(uint256 assets, address receiver) external returns (uint256);
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256);
    function updateAPY(uint256 newAPY) external onlyOwner;
}
```

#### **StrategyWatcherRSC (Reactive Lasna)**
```solidity
contract StrategyWatcherRSC is Reactive {
    function react(bytes calldata eventData) external;
    function triggerRebalance(uint256 threshold) external;
}
```

### **Frontend Hooks**

#### **useFluxVault**
```typescript
const {
  address,
  tokenBalance,
  vaultShares,
  currentAPY,
  depositToVault,
  redeemFromVault,
  isPending,
  error
} = useFluxVault();
```

---

## 🧪 **Testing Guide**

### **Test Scenarios**

1. **🔗 Wallet Connection**
   - Connect MetaMask
   - Switch between networks
   - Verify balance display

2. **💰 Deposit Flow**
   - Approve FLUX tokens
   - Deposit to vault
   - Receive vault shares

3. **📈 Strategy Monitoring**
   - View real-time APY
   - Monitor total assets
   - Check cross-chain sync

4. **💸 Withdrawal Flow**
   - Redeem vault shares
   - Receive underlying tokens
   - Verify balance updates

### **Network Testing**
- **Sepolia:** Primary operations testing
- **Reactive Lasna:** Cross-chain monitoring verification

---

## 🚀 **Deployment Options**

### **Testnet (Current)**
- ✅ Deployed and functional
- ✅ Ready for community testing
- ✅ Full feature demonstration

### **Mainnet (Future)**
- 🔄 Configuration ready
- 🔄 Security audits pending
- 🔄 Community governance setup

---

## 📈 **Roadmap**

### **Phase 1: Foundation** ✅
- [x] Core smart contracts
- [x] Cross-chain architecture
- [x] Basic frontend interface

### **Phase 2: Enhancement** ✅
- [x] Professional UI/UX
- [x] Advanced Web3 integration
- [x] Comprehensive testing

### **Phase 3: Production** 🔄
- [ ] Security audits
- [ ] Mainnet deployment
- [ ] Community launch

### **Phase 4: Expansion** 📋
- [ ] Additional chain support
- [ ] Advanced strategies
- [ ] Governance token

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

### **Development**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### **Testing**
1. Test the prototype on testnets
2. Report bugs and issues
3. Suggest improvements
4. Share feedback

### **Documentation**
1. Improve README and guides
2. Create tutorials and examples
3. Translate documentation
4. Write technical articles

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 **Links & Resources**

- **🌐 Live Demo:** http://localhost:3000/dashboard
- **📚 Documentation:** [Coming Soon]
- **💬 Discord:** [Community Server]
- **🐦 Twitter:** [@FluxVault]
- **📧 Email:** team@fluxvault.io

---

## 💫 **Acknowledgments**

Special thanks to:
- **Reactive Network** for cross-chain infrastructure
- **OpenZeppelin** for security frameworks
- **Hardhat** for development tools
- **Next.js** team for the frontend framework

---

<div align="center">

**🚀 Ready to experience the future of cross-chain DeFi?**

[**Launch Dashboard →**](http://localhost:3000/dashboard)

*Built with ❤️ by the FluxVault team*

</div>



## Project Structure## Overview



All project files have been moved to the `smartcontract` folder for better organization:FluxVault is a Cross-Chain Yield Optimizer dApp built on the **Reactive Lasna testnet**. It demonstrates how to use Reactive Smart Contracts (RSCs) to automatically monitor APY changes across different lending protocols and trigger rebalancing when better yield opportunities arise.



```## Architecture

FluxVault/

├── smartcontract/              # Main project directoryThe system consists of four main smart contracts:

│   ├── *.sol                   # Smart contracts

│   ├── lib/                    # Dependencies (reactive-lib)### Core Contracts (`/smartcontract/`)

│   ├── scripts/                # Deployment scripts

│   ├── package.json            # Node.js dependencies1. **OriginVault.sol** - ERC-20 vault where users deposit tokens and receive shares

│   ├── hardhat.config.js       # Hardhat configuration2. **MockLendingAdapter.sol** - Simulates lending protocols with adjustable APY for demo

│   ├── .env.example            # Environment template3. **StrategyWatcherRSC.sol** - Reactive Smart Contract that monitors APY changes

│   ├── README.md               # Detailed documentation4. **RebalancerRSC.sol** - Executes migrations when rebalancing conditions are met

│   └── remappings.txt          # Import mappings5. **TestToken.sol** - ERC-20 test token for demonstrations

├── .git/                       # Git repository

└── LICENSE                     # MIT License### How It Works

```

1. **User Deposits**: Users deposit test tokens into the OriginVault and receive shares

## Quick Start2. **APY Monitoring**: StrategyWatcherRSC subscribes to APY change events from adapters

3. **Automatic Rebalancing**: When APY changes meet thresholds, RebalancerRSC executes migrations

1. Navigate to the smartcontract directory:4. **Cross-Chain Operations**: All powered by Reactive Network's cross-chain capabilities

```bash

cd smartcontract## Getting Started

```

### Prerequisites

2. Install dependencies:

```bash- Node.js (v16+)

npm install- npm or yarn

```- A wallet with Lasna testnet REACT tokens

- Private key for deployment

3. Configure environment:

```bash### Installation

cp .env.example .env

# Edit .env with your private key1. Clone the repository:

``````bash

git clone <repository-url>

4. Deploy to Lasna testnet:cd FluxVault

```bash```

npm run deploy:lasna

npm run register2. Install dependencies:

npm run demo```bash

```npm install

```

## About

3. Copy and configure environment variables:

FluxVault is a Cross-Chain Yield Optimizer dApp built on Reactive Network's Lasna testnet. It automatically monitors APY changes across lending protocols and triggers rebalancing for optimal yield.```bash

cp .env.example .env

For detailed documentation, see [smartcontract/README.md](smartcontract/README.md).# Edit .env with your private key and RPC URLs

```

## License

### Configuration

MIT License - see [LICENSE](LICENSE) for details.
Edit `.env` file with your details:

```env
PRIVATE_KEY=your_private_key_here
LASNA_RPC_URL=https://lasna-rpc.rnk.dev/
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
```

### Get Testnet REACT Tokens

To get testnet REACT for deployment, send Sepolia ETH to the faucet:
- Faucet Address: `0x9b9BB25f1A81078C544C829c5EB7822d747Cf434`
- Exchange Rate: 1 SepETH = 5 REACT
- Max per request: 10 SepETH = 50 REACT

## Deployment & Demo

### 1. Deploy Contracts

Deploy all contracts to Lasna testnet:

```bash
npm run deploy:lasna
```

This will deploy:
- TestToken (FLUX)
- MockLendingAdapter 
- OriginVault
- RebalancerRSC
- StrategyWatcherRSC

### 2. Register Subscriptions

Register the reactive subscriptions:

```bash
npm run register
```

### 3. Run Demo

Execute the full demonstration workflow:

```bash
npm run demo
```

## Demo Workflow

The demo demonstrates the following scenario:

1. **Initial Setup**: User deposits test tokens into the vault
2. **APY Drop**: Simulate market conditions where APY drops below threshold (< 3%)
3. **Reactive Trigger**: StrategyWatcherRSC detects the change and evaluates rebalancing
4. **High Yield**: Simulate high yield opportunity (> 10%)
5. **Automatic Rebalancing**: RebalancerRSC executes migration if conditions are met

## Contract Addresses

After deployment, contract addresses are automatically saved to `.env`:

- `ORIGIN_VAULT_ADDR` - Main vault contract
- `MOCK_LENDING_ADAPTER_ADDR` - Simulated lending protocol
- `STRATEGY_WATCHER_RSC_ADDR` - Reactive monitoring contract  
- `REBALANCER_RSC_ADDR` - Rebalancing execution contract
- `TEST_TOKEN_ADDR` - Test token for demonstrations

## Rebalancing Thresholds

The system uses the following thresholds for automatic rebalancing:

- **Min APY Threshold**: 3% (below this triggers search for better opportunities)
- **Max APY Threshold**: 10% (above this prioritizes the adapter)
- **Rebalance Threshold**: 2% (minimum difference to trigger rebalancing)

## Monitoring

Monitor your deployed contracts on the Lasna block explorer:

- **Lasna Explorer**: https://lasna.reactscan.net/
- **Contract Verification**: Contracts are automatically verified on Sourcify

## Project Structure

```
FluxVault/
├── smartcontract/           # Smart contracts
│   ├── OriginVault.sol
│   ├── MockLendingAdapter.sol
│   ├── StrategyWatcherRSC.sol
│   ├── RebalancerRSC.sol
│   ├── TestToken.sol
│   └── lib/                 # Reactive library
│       └── reactive-lib/
├── scripts/                 # Deployment scripts
│   ├── lasna-deploy.js
│   ├── register-subscription.js
│   └── trigger-demo.js
├── hardhat.config.js        # Hardhat configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## Technical Details

### Reactive Network Integration

The project leverages Reactive Network's capabilities:

- **Event Subscriptions**: StrategyWatcherRSC subscribes to `APYUpdated` events
- **Cross-Chain Callbacks**: RebalancerRSC receives callbacks from reactive events
- **Automatic Execution**: No manual intervention required for rebalancing

### Gas Optimization

- Rebalancing has gas price limits (max 50 gwei)
- Minimum rebalancing interval (1 hour) to prevent excessive transactions
- Batch operations for multiple users

### Security Features

- Reentrancy protection on all external calls
- Access control with owner-only functions
- Emergency pause functionality
- Authorized adapter registry

## Troubleshooting

### Common Issues

1. **Insufficient REACT**: Make sure you have enough REACT tokens for deployment
2. **RPC Issues**: Verify your RPC URLs are correct in `.env`
3. **Private Key**: Ensure your private key is valid and has sufficient balance

### Getting Help

- Check the [Reactive Network Documentation](https://dev.reactive.network/)
- View transaction details on [Lasna Explorer](https://lasna.reactscan.net/)
- Review deployment logs for specific error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on [Reactive Network](https://reactive.network/)
- Uses [Hardhat](https://hardhat.org/) for development
- Integrates [OpenZeppelin](https://openzeppelin.com/) contracts
Cross-Chain Yield Optimizer
