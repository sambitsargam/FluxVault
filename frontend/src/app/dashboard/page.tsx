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
    approveToken,
    depositToVault,
    redeemFromVault,
    isPending,
    isSuccess,
    error,
    isLasna,
    isSepolia,
    explorerUrl
  } = useFluxVault()

  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawShares, setWithdrawShares] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
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
    )
  }

  const chainName = isLasna ? 'Reactive Lasna' : isSepolia ? 'Sepolia' : 'Unknown Chain'
  const chainColor = isLasna ? 'text-red-600' : isSepolia ? 'text-blue-600' : 'text-gray-600'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">FluxVault Dashboard</Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <div className="text-gray-600">Connected to:</div>
                <div className={`font-semibold ${chainColor}`}>{chainName}</div>
              </div>
              <button
                onClick={() => disconnect()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Wallet Address</div>
              <div className="font-mono text-sm">
                {mounted && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Loading...'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{nativeSymbol || 'ETH'} Balance</div>
              <div className="font-semibold">
                {mounted ? parseFloat(nativeBalance || '0').toFixed(4) : '--'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">FLUX Balance</div>
              <div className="font-semibold">
                {mounted ? parseFloat(tokenBalance || '0').toFixed(2) : '--'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Vault Shares</div>
              <div className="font-semibold">
                {mounted ? parseFloat(vaultShares || '0').toFixed(2) : '--'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Vault Operations</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Vault Statistics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Total Assets</div>
                    <div className="font-semibold">
                      {mounted ? parseFloat(totalAssets || '0').toFixed(2) : '--'} FLUX
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Current APY</div>
                    <div className="font-semibold text-green-600">
                      {mounted ? currentAPY || '0' : '--'}%
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit FLUX Tokens
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Amount to deposit"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => approveToken(depositAmount)}
                    disabled={!depositAmount || isPending}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => depositToVault(depositAmount)}
                    disabled={!depositAmount || isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isPending ? 'Depositing...' : 'Deposit'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdraw Vault Shares
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={withdrawShares}
                    onChange={(e) => setWithdrawShares(e.target.value)}
                    placeholder="Shares to withdraw"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => redeemFromVault(withdrawShares)}
                    disabled={!withdrawShares || isPending}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {isPending ? 'Withdrawing...' : 'Withdraw'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Contract Information</h2>
            
            <div className="space-y-4">
              {mounted && contracts.originVault && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Origin Vault (Sepolia)</div>
                  <a
                    href={`${explorerUrl}/address/${contracts.originVault}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all"
                  >
                    {contracts.originVault}
                  </a>
                </div>
              )}
              
              {mounted && contracts.strategyWatcher && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Strategy Watcher (Lasna)</div>
                  <a
                    href={`${explorerUrl}/address/${contracts.strategyWatcher}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all"
                  >
                    {contracts.strategyWatcher}
                  </a>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Cross-Chain Architecture</h3>
                <div className="text-blue-800 text-sm space-y-1">
                  <p>• Sepolia: Origin vault for deposits/withdrawals</p>
                  <p>• Reactive Lasna: Strategy monitoring & rebalancing</p>
                  <p>• Real-time cross-chain synchronization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
