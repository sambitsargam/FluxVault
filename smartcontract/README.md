# FluxVault - Cross-Chain Yield Optimizer dApp

## Overview

FluxVault is a Cross-Chain Yield Optimizer dApp built on the **Reactive Lasna testnet**. It demonstrates how to use Reactive Smart Contracts (RSCs) to automatically monitor APY changes across different lending protocols and trigger rebalancing when better yield opportunities arise.

## Architecture

The system consists of four main smart contracts:

### Core Contracts (`/smartcontract/`)

1. **OriginVault.sol** - ERC-20 vault where users deposit tokens and receive shares
2. **MockLendingAdapter.sol** - Simulates lending protocols with adjustable APY for demo
3. **StrategyWatcherRSC.sol** - Reactive Smart Contract that monitors APY changes
4. **RebalancerRSC.sol** - Executes migrations when rebalancing conditions are met
5. **TestToken.sol** - ERC-20 test token for demonstrations

### How It Works

1. **User Deposits**: Users deposit test tokens into the OriginVault and receive shares
2. **APY Monitoring**: StrategyWatcherRSC subscribes to APY change events from adapters
3. **Automatic Rebalancing**: When APY changes meet thresholds, RebalancerRSC executes migrations
4. **Cross-Chain Operations**: All powered by Reactive Network's cross-chain capabilities

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A wallet with Lasna testnet REACT tokens
- Private key for deployment

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FluxVault
```

2. Install dependencies:
```bash
npm install
```

3. Copy and configure environment variables:
```bash
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

### Configuration

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
