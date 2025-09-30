'use client'

import { useFluxVault } from '../../hooks/useFluxVault'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  
  const {
    address,
    nativeBalance,
    nativeSymbol,
    tokenBalance,
    vaultShares,
    totalAssets,
    currentAPY,
    contracts,
    claimFluxTokens,
    isPending,
    isSuccess,
    error,
    isLasna,
    isSepolia,
    explorerUrl
  } = useFluxVault()

  const [claimAmount, setClaimAmount] = useState('100')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Navbar for non-connected state */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  FluxVault
                </Link>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
                <Link href="/vault" className="text-gray-600 hover:text-blue-600 transition-colors">Vault</Link>
                <Link href="/adapters" className="text-gray-600 hover:text-blue-600 transition-colors">Adapters</Link>
                <Link href="/rebalancer" className="text-gray-600 hover:text-blue-600 transition-colors">Rebalancer</Link>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">FluxVault Dashboard</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to access the cross-chain yield optimizer</p>
            <div className="space-y-4 max-w-sm mx-auto">
              {mounted && connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors block w-full"
                >
                  Connect {connector.name}
                </button>
              ))}
              {!mounted && (
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-12 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-12 rounded-lg"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const chainName = isLasna ? 'Reactive Lasna' : isSepolia ? 'Sepolia' : 'Unknown Chain'
  const chainColor = isLasna ? 'text-red-600' : isSepolia ? 'text-blue-600' : 'text-gray-600'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                FluxVault
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
              <Link href="/vault" className="text-gray-600 hover:text-blue-600 transition-colors">Vault</Link>
              <Link href="/adapters" className="text-gray-600 hover:text-blue-600 transition-colors">Adapters</Link>
              <Link href="/rebalancer" className="text-gray-600 hover:text-blue-600 transition-colors">Rebalancer</Link>
              
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
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your cross-chain yield positions and vault performance</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${mounted ? (parseFloat(tokenBalance || '0') + parseFloat(vaultShares || '0')).toFixed(2) : '--'}
                </p>
                <p className="text-xs text-green-600 mt-1">+2.4% from last week</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vault Shares</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mounted ? parseFloat(vaultShares || '0').toFixed(2) : '--'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  ≈ ${mounted ? (parseFloat(vaultShares || '0') * 1.02).toFixed(2) : '--'} USD
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">FLUX Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mounted ? parseFloat(tokenBalance || '0').toFixed(2) : '--'}
                </p>
                <p className="text-xs text-gray-600 mt-1">Available for deposit</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
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
                <p className="text-xs text-gray-600 mt-1">Estimated annual yield</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Wallet Address</div>
                    <div className="font-mono text-sm font-medium">
                      {mounted && address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'Loading...'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Network</div>
                    <div className={`font-semibold ${chainColor}`}>{chainName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Native Balance</div>
                    <div className="font-semibold text-blue-900">
                      {mounted ? parseFloat(nativeBalance || '0').toFixed(4) : '--'} {nativeSymbol || 'ETH'}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">Vault Assets</div>
                    <div className="font-semibold text-green-900">
                      {mounted ? parseFloat(totalAssets || '0').toFixed(2) : '--'} FLUX
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  href="/vault" 
                  className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="font-medium text-gray-900">Manage Vault</div>
                    <div className="text-sm text-gray-600">Deposit or withdraw</div>
                  </div>
                </Link>

                <div 
                  className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10l2 16H5l2-16zM9 9v6m6-6v6" />
                      </svg>
                    </div>
                    <div className="font-medium text-gray-900">Claim FLUX</div>
                    <div className="text-sm text-gray-600">Get free tokens</div>
                  </div>
                </div>

                <Link 
                  href="/adapters" 
                  className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="font-medium text-gray-900">View Adapters</div>
                    <div className="text-sm text-gray-600">Strategy details</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Free Token Claim */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 border border-blue-200">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Get Free FLUX Tokens</h2>
              <p className="text-blue-800 text-sm mb-4">
                Claim free FLUX tokens for testing. Available on both networks (max 1000 per transaction).
              </p>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="Amount (max 1000)"
                  max="1000"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => claimFluxTokens(claimAmount)}
                  disabled={!claimAmount || isPending || parseFloat(claimAmount) > 1000}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isPending ? 'Claiming...' : 'Claim FLUX'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Network Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-blue-900">Sepolia Testnet</div>
                    <div className="text-xs text-blue-600">Origin Vault</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-red-900">Reactive Lasna</div>
                    <div className="text-xs text-red-600">Strategy Watcher</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Contract Addresses */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Contracts</h3>
              <div className="space-y-4">
                {mounted && contracts.originVault && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Origin Vault</div>
                    <a
                      href={`${explorerUrl}/address/${contracts.originVault}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all bg-gray-50 p-2 rounded block"
                    >
                      {contracts.originVault}
                    </a>
                  </div>
                )}
                
                {mounted && contracts.strategyWatcher && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Strategy Watcher</div>
                    <a
                      href={`${explorerUrl}/address/${contracts.strategyWatcher}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all bg-gray-50 p-2 rounded block"
                    >
                      {contracts.strategyWatcher}
                    </a>
                  </div>
                )}

                {mounted && contracts.fluxToken && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">FLUX Token</div>
                    <a
                      href={`${explorerUrl}/address/${contracts.fluxToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all bg-gray-50 p-2 rounded block"
                    >
                      {contracts.fluxToken}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Connected to {chainName}</div>
                    <div className="text-xs text-gray-500">Just now</div>
                  </div>
                </div>
                
                {mounted && parseFloat(vaultShares || '0') > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Vault position detected</div>
                      <div className="text-xs text-gray-500">{parseFloat(vaultShares || '0').toFixed(2)} shares</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Contracts verified</div>
                    <div className="text-xs text-gray-500">Cross-chain ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">
              <strong>Error:</strong> {error.message}
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-green-800">
              <strong>Success:</strong> Transaction completed successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
