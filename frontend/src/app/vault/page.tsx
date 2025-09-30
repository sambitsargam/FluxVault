'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useFluxVault } from '../../hooks/useFluxVault'
import Link from 'next/link'

export default function Vault() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  
  const {
    address,
    tokenBalance,
    vaultShares,
    totalAssets,
    currentAPY,
    contracts,
    approveToken,
    depositToVault,
    redeemFromVault,
    claimFluxTokens,
    isPending,
    isSuccess,
    error,
    isLasna,
    isSepolia,
    explorerUrl
  } = useFluxVault()

  const [activeTab, setActiveTab] = useState('deposit')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawShares, setWithdrawShares] = useState('')
  const [claimAmount, setClaimAmount] = useState('500')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const chainName = isLasna ? 'Reactive Lasna' : isSepolia ? 'Sepolia' : 'Unknown Chain'
  const chainColor = isLasna ? 'text-red-600' : isSepolia ? 'text-blue-600' : 'text-gray-600'

  const handleMaxDeposit = () => {
    if (tokenBalance) {
      setDepositAmount(tokenBalance)
    }
  }

  const handleMaxWithdraw = () => {
    if (vaultShares) {
      setWithdrawShares(vaultShares)
    }
  }

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
              <Link href="/vault" className="text-blue-600 font-medium">Vault</Link>
              <Link href="/adapters" className="text-gray-600 hover:text-blue-600 transition-colors">Adapters</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FluxVault Origin Vault</h1>
          <p className="text-gray-600">
            Cross-chain yield optimization vault powered by Reactive Smart Contracts
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Wallet to Access Vault</h2>
            <p className="text-gray-600 mb-6">Connect your wallet to deposit, withdraw, and monitor your vault positions</p>
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
            </div>
          </div>
        ) : (
          <>
            {/* Vault Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assets</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mounted ? `${parseFloat(totalAssets || '0').toFixed(2)} FLUX` : '--'}
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">Your Shares</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mounted ? parseFloat(vaultShares || '0').toFixed(2) : '--'}
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
                    <p className="text-sm font-medium text-gray-600">Your FLUX Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mounted ? parseFloat(tokenBalance || '0').toFixed(2) : '--'}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {mounted ? `${currentAPY || '0'}%` : '--'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Vault Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Deposit/Withdraw Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                      <button
                        onClick={() => setActiveTab('claim')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 ${
                          activeTab === 'claim'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Claim FLUX
                      </button>
                      <button
                        onClick={() => setActiveTab('deposit')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 ${
                          activeTab === 'deposit'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => setActiveTab('withdraw')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 ${
                          activeTab === 'withdraw'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Withdraw
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'claim' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Free FLUX Tokens</h3>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Claim Amount</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={claimAmount}
                              onChange={(e) => setClaimAmount(e.target.value)}
                              placeholder="Amount to claim"
                              max="1000"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute right-3 top-3">
                              <span className="text-sm text-gray-500">FLUX</span>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between text-sm text-gray-600">
                            <span>Max per transaction: 1000 FLUX</span>
                            <button 
                              onClick={() => setClaimAmount('1000')}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Max
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => claimFluxTokens(claimAmount)}
                          disabled={!claimAmount || isPending || parseFloat(claimAmount) > 1000}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isPending ? 'Claiming...' : 'Claim Free FLUX Tokens'}
                        </button>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-800">
                              <p className="font-medium">Free Testnet Tokens</p>
                              <p className="mt-1">Claim free FLUX tokens for testing. Available on both Sepolia and Lasna networks. Maximum 1000 tokens per transaction.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'deposit' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposit FLUX Tokens</h3>
                        
                        <div className="mb-6">
                          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-600 font-semibold text-sm">FLUX</span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">FLUX Token</div>
                                  <div className="text-xs text-gray-500">
                                    Balance: {mounted ? parseFloat(tokenBalance || '0').toFixed(2) : '--'}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">Selected</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute right-3 top-3">
                              <span className="text-sm text-gray-500">FLUX</span>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between text-sm text-gray-600">
                            <span>Available: {mounted ? parseFloat(tokenBalance || '0').toFixed(2) : '--'} FLUX</span>
                            <button 
                              onClick={handleMaxDeposit}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Max
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <button 
                            onClick={() => approveToken(depositAmount)}
                            disabled={!depositAmount || isPending || !isSepolia}
                            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-50"
                          >
                            {isPending ? 'Processing...' : 'Approve FLUX'}
                          </button>
                          
                          <button 
                            onClick={() => depositToVault(depositAmount)}
                            disabled={!depositAmount || isPending || !isSepolia}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {isPending ? 'Depositing...' : 'Deposit to Vault'}
                          </button>
                        </div>

                        {!isSepolia && (
                          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              ⚠️ Switch to Sepolia testnet to deposit into the vault
                            </p>
                          </div>
                        )}

                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-green-800">
                              <p className="font-medium">Deposit Information</p>
                              <p className="mt-1">Your FLUX tokens will be deposited into the vault and you&apos;ll receive vault shares. The vault automatically optimizes yield across different strategies.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'withdraw' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw from Vault</h3>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Withdraw Amount (Shares)</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={withdrawShares}
                              onChange={(e) => setWithdrawShares(e.target.value)}
                              placeholder="0.00"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute right-3 top-3">
                              <span className="text-sm text-gray-500">Shares</span>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between text-sm text-gray-600">
                            <span>Available Shares: {mounted ? parseFloat(vaultShares || '0').toFixed(2) : '--'}</span>
                            <button 
                              onClick={handleMaxWithdraw}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Max
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => redeemFromVault(withdrawShares)}
                          disabled={!withdrawShares || isPending || !isSepolia}
                          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {isPending ? 'Withdrawing...' : 'Withdraw from Vault'}
                        </button>

                        {!isSepolia && (
                          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              ⚠️ Switch to Sepolia testnet to withdraw from the vault
                            </p>
                          </div>
                        )}

                        <div className="mt-4 p-4 bg-red-50 rounded-lg">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div className="text-sm text-red-800">
                              <p className="font-medium">Withdrawal Information</p>
                              <p className="mt-1">Withdrawing will burn your vault shares and return the equivalent value in FLUX tokens. This may trigger rebalancing strategies.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vault Information Panel */}
              <div className="space-y-6">
                {/* Vault Details */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vault Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Vault Address</span>
                      <a
                        href={`${explorerUrl}/address/${contracts.originVault}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-mono text-blue-600 hover:text-blue-800"
                      >
                        {contracts.originVault ? `${contracts.originVault.slice(0, 6)}...${contracts.originVault.slice(-4)}` : 'N/A'}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Network</span>
                      <span className={`text-sm font-medium ${chainColor}`}>{chainName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Assets</span>
                      <span className="text-sm text-gray-900">
                        {mounted ? `${parseFloat(totalAssets || '0').toFixed(2)} FLUX` : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Your Shares</span>
                      <span className="text-sm text-gray-900">
                        {mounted ? parseFloat(vaultShares || '0').toFixed(4) : '--'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cross-Chain Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Chain Architecture</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-blue-900">Sepolia Testnet</div>
                        <div className="text-xs text-blue-600">Origin Vault & FLUX Token</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-900">Primary</div>
                        <div className="text-xs text-blue-600">Deposits & Withdrawals</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-red-900">Reactive Lasna</div>
                        <div className="text-xs text-red-600">Strategy Monitoring</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-900">Reactive</div>
                        <div className="text-xs text-red-600">Auto-rebalancing</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategy Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Strategies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Strategy Watcher</div>
                        <div className="text-xs text-gray-500">Reactive Smart Contract</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Active</div>
                        <div className="text-xs text-gray-500">Auto-monitoring</div>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">More strategies coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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
