'use client'

import { useReadContract, useWriteContract, useAccount, useBalance } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { CONTRACT_ADDRESSES, FLUX_TOKEN_ABI, ORIGIN_VAULT_ABI, STRATEGY_WATCHER_ABI, MOCK_ADAPTER_ABI } from '../config/contracts'

export function useFluxVault() {
  const { address, chainId } = useAccount()

  // Get contract addresses based on current chain
  const getContractAddress = (contractName: string) => {
    if (chainId === 5318007) {
      return CONTRACT_ADDRESSES.lasna.contracts[contractName as keyof typeof CONTRACT_ADDRESSES.lasna.contracts]
    } else if (chainId === 11155111) {
      return CONTRACT_ADDRESSES.sepolia.contracts[contractName as keyof typeof CONTRACT_ADDRESSES.sepolia.contracts]
    }
    return undefined
  }

  // Token balance
  const { data: tokenBalance } = useReadContract({
    address: getContractAddress('fluxToken') as `0x${string}`,
    abi: FLUX_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address && !!getContractAddress('fluxToken'),
    },
  })

  // Vault shares balance
  const { data: vaultShares } = useReadContract({
    address: getContractAddress('originVault') as `0x${string}`,
    abi: ORIGIN_VAULT_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address && !!getContractAddress('originVault'),
    },
  })

  // Total assets in vault
  const { data: totalAssets } = useReadContract({
    address: getContractAddress('originVault') as `0x${string}`,
    abi: ORIGIN_VAULT_ABI,
    functionName: 'totalAssets',
    query: {
      enabled: !!getContractAddress('originVault'),
    },
  })

  // Total supply of vault shares
  const { data: totalSupply } = useReadContract({
    address: getContractAddress('originVault') as `0x${string}`,
    abi: ORIGIN_VAULT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!getContractAddress('originVault'),
    },
  })

  // Strategy thresholds (only on Lasna)
  const { data: thresholds } = useReadContract({
    address: CONTRACT_ADDRESSES.lasna.contracts.strategyWatcherRSC as `0x${string}`,
    abi: STRATEGY_WATCHER_ABI,
    functionName: 'getThresholds',
    query: {
      enabled: chainId === 5318007,
    },
  })

  // Current APY from adapter
  const adapterAddress = chainId === 5318007 
    ? CONTRACT_ADDRESSES.lasna.contracts.mockAdapter
    : CONTRACT_ADDRESSES.sepolia.contracts.aaveAdapter

  const { data: currentAPY } = useReadContract({
    address: adapterAddress as `0x${string}`,
    abi: MOCK_ADAPTER_ABI,
    functionName: 'getCurrentAPY',
    query: {
      enabled: !!adapterAddress,
    },
  })

  // Native balance
  const { data: nativeBalance } = useBalance({
    address: address,
  })

  // Contract write functions
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const approveToken = (amount: string) => {
    const vaultAddress = getContractAddress('originVault')
    const tokenAddress = getContractAddress('fluxToken')
    
    if (!vaultAddress || !tokenAddress) return

    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: FLUX_TOKEN_ABI,
      functionName: 'approve',
      args: [vaultAddress as `0x${string}`, parseUnits(amount, 18)],
    })
  }

  const depositToVault = (amount: string) => {
    const vaultAddress = getContractAddress('originVault')
    if (!vaultAddress || !address) return

    writeContract({
      address: vaultAddress as `0x${string}`,
      abi: ORIGIN_VAULT_ABI,
      functionName: 'deposit',
      args: [parseUnits(amount, 18), address],
    })
  }

  const redeemFromVault = (shares: string) => {
    const vaultAddress = getContractAddress('originVault')
    if (!vaultAddress || !address) return

    writeContract({
      address: vaultAddress as `0x${string}`,
      abi: ORIGIN_VAULT_ABI,
      functionName: 'redeem',
      args: [parseUnits(shares, 18), address, address],
    })
  }

  const claimFluxTokens = (amount: string) => {
    const tokenAddress = getContractAddress('fluxToken')
    if (!tokenAddress) return

    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: FLUX_TOKEN_ABI,
      functionName: 'faucet',
      args: [parseUnits(amount, 18)],
    })
  }

  const updateAPY = (newAPY: number) => {
    if (!adapterAddress) return

    writeContract({
      address: adapterAddress as `0x${string}`,
      abi: MOCK_ADAPTER_ABI,
      functionName: 'updateAPY',
      args: [BigInt(newAPY * 100)], // Convert percentage to basis points
    })
  }

  // Helper functions to format values
  const formatToken = (value: unknown) => 
    value && typeof value === 'bigint' ? formatUnits(value, 18) : '0'

  const formatAPY = (value: unknown) => 
    value && typeof value === 'bigint' ? (Number(value) / 100).toFixed(2) : '0.00'

  return {
    // Account info
    address,
    chainId,
    nativeBalance: nativeBalance?.formatted || '0',
    nativeSymbol: nativeBalance?.symbol || 'ETH',

    // Token data
    tokenBalance: formatToken(tokenBalance),
    vaultShares: formatToken(vaultShares),
    totalAssets: formatToken(totalAssets),
    totalSupply: formatToken(totalSupply),

    // Strategy data
    currentAPY: formatAPY(currentAPY),
    minThreshold: thresholds && Array.isArray(thresholds) ? (Number(thresholds[0]) / 100).toFixed(2) : '0.00',
    maxThreshold: thresholds && Array.isArray(thresholds) ? (Number(thresholds[1]) / 100).toFixed(2) : '0.00',
    rebalanceThreshold: thresholds && Array.isArray(thresholds) ? (Number(thresholds[2]) / 100).toFixed(2) : '0.00',

    // Contract addresses
    contracts: {
      fluxToken: getContractAddress('fluxToken'),
      originVault: getContractAddress('originVault'),
      strategyWatcher: chainId === 5318007 ? CONTRACT_ADDRESSES.lasna.contracts.strategyWatcherRSC : undefined,
      rebalancer: chainId === 5318007 ? CONTRACT_ADDRESSES.lasna.contracts.rebalancerRSC : undefined,
    },

    // Actions
    approveToken,
    depositToVault,
    redeemFromVault,
    claimFluxTokens,
    updateAPY,

    // Transaction state
    isPending,
    isSuccess,
    error,

    // Chain info
    isLasna: chainId === 5318007,
    isSepolia: chainId === 11155111,
    explorerUrl: chainId === 5318007 
      ? 'https://lasna.reactscan.net' 
      : 'https://sepolia.etherscan.io',
  }
}