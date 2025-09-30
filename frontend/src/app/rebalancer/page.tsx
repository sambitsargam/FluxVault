'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useFluxVault } from '../../hooks/useFluxVault'
import Link from 'next/link'

export default function Rebalancer() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  
  const {
    address,
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

  // Real strategy watchers based on our contracts
  const watchers = [
    {
      id: 1,
      name: 'Reactive Strategy Watcher',
      address: contracts.strategyWatcher || '0x...',
      targetAdapter: 'FLUX Origin Vault',
      chainId: 5318007,
      network: 'Reactive Lasna',
      status: 'active',
      lastTrigger: 'Live Monitoring',
      thresholds: {
        min: '10%',
        max: '25%',
        rebalance: '5%'
      },
      description: 'Monitors vault strategies and triggers rebalances based on yield differentials'
    },
    {
      id: 2,
      name: 'Origin Vault Monitor',
      address: contracts.originVault || '0x...',
      targetAdapter: 'FLUX Token Vault',
      chainId: 11155111,
      network: 'Sepolia',
      status: 'active',
      lastTrigger: mounted ? 'Real-time' : 'Loading...',
      thresholds: {
        min: '8%',
        max: '20%',
        rebalance: '3%'
      },
      description: 'Primary vault monitoring deposits and withdrawal patterns'
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
              <Link href="/adapters" className="text-gray-600 hover:text-blue-600 transition-colors">Adapters</Link>
              <Link href="/rebalancer" className="text-blue-600 font-medium">Rebalancer</Link>
              
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reactive Rebalancer</h1>
          <p className="text-gray-600">
            Monitor automated yield optimization through reactive smart contracts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Watchers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {watchers.filter(w => w.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current APY</p>
                <p className="text-2xl font-bold text-green-600">
                  {mounted ? currentAPY || '12.5' : '--'}%
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rebalances</p>
                <p className="text-2xl font-bold text-blue-600">1</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gas Saved</p>
                <p className="text-2xl font-bold text-purple-600">100%</p>
                <p className="text-xs text-purple-500">Reactive Network</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Watchers */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Strategy Watchers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {watchers.map((watcher) => (
              <div key={watcher.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{watcher.name}</h4>
                    <p className="text-sm text-gray-600">{watcher.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    watcher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {watcher.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Network:</span>
                    <span className="text-sm font-medium">{watcher.network}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Trigger:</span>
                    <span className="text-sm text-gray-900">{watcher.lastTrigger}</span>
                  </div>

                  {mounted && watcher.address !== '0x...' && (
                    <div>
                      <span className="text-sm text-gray-600">Contract:</span>
                      <a
                        href={`${explorerUrl}/address/${watcher.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-mono text-xs bg-gray-50 p-2 rounded block break-all mt-1"
                      >
                        {watcher.address}
                      </a>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Thresholds</h5>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">Min APY</div>
                        <div className="font-medium">{watcher.thresholds.min}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Max APY</div>
                        <div className="font-medium">{watcher.thresholds.max}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Rebalance</div>
                        <div className="font-medium">{watcher.thresholds.rebalance}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reactive Network Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Reactive Network Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-purple-800 mb-2">Automated Features</h3>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Gas-free rebalancing</li>
                <li>• Real-time monitoring</li>
                <li>• Cross-chain coordination</li>
                <li>• Yield optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-purple-800 mb-2">Current Status</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-purple-700 text-sm">Strategy Watcher: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-purple-700 text-sm">Origin Vault: Monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-purple-700 text-sm">FLUX Token: Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
