import { Chain } from 'viem'

// Custom chain definitions
export const lasna = {
  id: 5318007,
  name: 'Reactive Lasna',
  nativeCurrency: {
    decimals: 18,
    name: 'REACT',
    symbol: 'REACT',
  },
  rpcUrls: {
    default: {
      http: ['https://lasna-rpc.rnk.dev/'],
    },
  },
  blockExplorers: {
    default: { name: 'Lasna ReactScan', url: 'https://lasna.reactscan.net' },
  },
} as const satisfies Chain

export const sepolia = {
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'SepoliaETH',
    symbol: 'SEP',
  },
  rpcUrls: {
    default: {
      http: ['https://ethereum-sepolia-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
} as const satisfies Chain

// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  // Reactive Layer (Lasna)
  lasna: {
    chainId: 5318007,
    contracts: {
      strategyWatcherRSC: '0x55e5B3A258d3F4f3a74883E34741DA0159093c2B',
      rebalancerRSC: '0x15D102AbBa1F856434863a9DFCfDD999EA2FFb36',
      fluxToken: '0xFeDFF163D7139e0F3b1C0d012e9a39CDfd539092',
      mockAdapter: '0x4a66F27329Cc3410a9dCc61A019a60A0767c127E',
      originVault: '0x497Dfac7C307FBAF85f083c438b88710c9cc4915'
    }
  },
  // Origin Layer (Sepolia)
  sepolia: {
    chainId: 11155111,
    contracts: {
      fluxToken: '0x0AF28FaE437CBa8A7C91224E1a8E9fE31d2fb19b',
      originVault: '0x4AB4a316B3D0fa0e17F1e7C28d48af6C27A61329',
      aaveAdapter: '0xCc7286e01efF2d988b6937c1B56c2CebD65b56e8'
    }
  }
} as const

// Supported chains
export const SUPPORTED_CHAINS = [lasna, sepolia] as const

// Default chain
export const DEFAULT_CHAIN = lasna

// Contract ABIs - Essential functions only
export const FLUX_TOKEN_ABI = [
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"type": "bool"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  }
] as const

export const ORIGIN_VAULT_ABI = [
  {
    "inputs": [{"name": "assets", "type": "uint256"}, {"name": "receiver", "type": "address"}],
    "name": "deposit",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "shares", "type": "uint256"}, {"name": "receiver", "type": "address"}, {"name": "owner", "type": "address"}],
    "name": "redeem",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  }
] as const

export const STRATEGY_WATCHER_ABI = [
  {
    "inputs": [],
    "name": "getThresholds",
    "outputs": [{"type": "uint256"}, {"type": "uint256"}, {"type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "adapter", "type": "address"}],
    "name": "getLastKnownAPY",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  }
] as const

export const MOCK_ADAPTER_ABI = [
  {
    "inputs": [],
    "name": "getCurrentAPY",
    "outputs": [{"type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "newAPY", "type": "uint256"}],
    "name": "updateAPY",
    "outputs": [],
    "type": "function"
  }
] as const