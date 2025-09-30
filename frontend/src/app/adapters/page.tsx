'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useFluxVault } from '../../hooks/useFluxVault'
import Link from 'next/link'

export default function Adapters() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  
  const {
    address,
    totalAssets,
    currentAPY,
    contracts,
    isLasna,
    isSepolia,
    explorerUrl
  } = useFluxVault()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const chainName = isLasna ? 'Reactive Lasna' : isSepolia ? 'Sepolia' : 'Unknown Chain'
  const chainColor = isLasna ? 'text-red-600' : isSepolia ? 'text-blue-600' : 'text-gray-600'

  // Real adapter data based on our deployed contracts
  const adapters = [
    {
      id: 1,
      name: 'FLUX Origin Vault',
      address: contracts.originVault || '0x...',
      network: 'Sepolia',
      apy: currentAPY || '12.5',
      tvl: `${parseFloat(totalAssets || '0').toFixed(2)} FLUX`,
      status: 'active',
      risk: 'low',
      description: 'Primary vault for FLUX token deposits with cross-chain yield optimization',
      assets: ['FLUX'],
      lastUpdate: 'Live',
      type: 'Vault',
      verified: true
    },
    {
      id: 2,
      name: 'Strategy Watcher',
      address: contracts.strategyWatcher || '0x...',
      network: 'Reactive Lasna',
      apy: '0.0',
      tvl: 'Monitoring',
      status: 'active',
      risk: 'none',
      description: 'Reactive smart contract monitoring vault strategies and triggering rebalances',
      assets: ['Cross-chain'],
      lastUpdate: 'Live',
      type: 'Watcher',
      verified: true
    },
    {
      id: 3,
      name: 'FLUX Token Faucet',
      address: contracts.fluxToken || '0x...',
      network: isSepolia ? 'Sepolia' : 'Lasna',
      apy: '∞',
      tvl: 'Unlimited',
      status: 'active',
      risk: 'none',
      description: 'Free FLUX token distribution for testing and development purposes',
      assets: ['FLUX'],
      lastUpdate: 'Live',
      type: 'Faucet',
      verified: true
    },
    {
      id: 4,
      name: 'Cross-Chain Bridge',
      address: '0x...',
      network: 'Multi-chain',
      apy: '0.0',
      tvl: 'Bridging',
      status: 'planned',
      risk: 'medium',
      description: 'Automated asset bridging between Sepolia and Reactive Lasna networks',
      assets: ['FLUX', 'ETH'],
      lastUpdate: 'Coming Soon',
      type: 'Bridge',
      verified: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                FluxVault
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
              <Link href="/vault" className="text-gray-600 hover:text-blue-600 transition-colors">Vault</Link>
              <Link href="/adapters" className="text-blue-600 font-medium">Adapters</Link>
              <Link href="/rebalancer" className="text-gray-600 hover:text-blue-600 transition-colors">Rebalancer</Link>
              
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <div className="text-gray-600">Connected:</div>
                    <div className={`font-semibold ${chainColor}`}>{chainName}</div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {mounted && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Disconnect'}
                  </button>
                </div>
              ) : (
                <div className="space-x-2">
                  {mounted && connectors.slice(0, 1).map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Connect Wallet
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategy Adapters</h1>
          <p className="text-gray-600">
            Monitor and manage cross-chain yield strategies and smart contract integrations
          </p>
        </div>

        {/* Adapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adapters.map((adapter) => (
            <div key={adapter.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{adapter.name}</h3>
                  <p className="text-sm text-gray-500">{adapter.network}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    adapter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {adapter.status}
                  </span>
                  {adapter.verified && (
                    <span className="text-xs text-green-600">✓ Verified</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">{adapter.apy}%</div>
                  <div className="text-sm text-gray-500">APY</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{adapter.tvl}</div>
                  <div className="text-sm text-gray-500">TVL</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{adapter.description}</p>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Assets</div>
                  <div className="flex flex-wrap gap-1">
                    {adapter.assets.map((asset, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                {mounted && adapter.address !== '0x...' && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Contract</div>
                    <a
                      href={`${explorerUrl}/address/${adapter.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-xs bg-gray-50 p-2 rounded block break-all"
                    >
                      {adapter.address}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Cross-Chain Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Sepolia Testnet</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Origin Vault for deposits</li>
                <li>• FLUX token contract</li>
                <li>• Primary user interactions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Reactive Lasna</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Strategy monitoring</li>
                <li>• Automated rebalancing</li>
                <li>• Cross-chain events</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
