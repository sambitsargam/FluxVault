'use client';

import { useState } from 'react';

export default function Vault() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-600">
                FluxVault
              </a>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</a>
              <a href="/vault" className="text-blue-600 font-medium">Vault</a>
              <a href="/adapters" className="text-gray-600 hover:text-blue-600 transition-colors">Adapters</a>
              <a href="/rebalancer" className="text-gray-600 hover:text-blue-600 transition-colors">Rebalancer</a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                0x1234...5678
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Origin Vault</h1>
          <p className="text-gray-600">Deposit and withdraw assets to start earning yield with automatic optimization</p>
        </div>

        {/* Vault Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">$24,567.89</p>
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
                <p className="text-2xl font-bold text-gray-900">2,456.79</p>
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
                <p className="text-sm font-medium text-gray-600">Current APY</p>
                <p className="text-2xl font-bold text-gray-900">15.2%</p>
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
                {activeTab === 'deposit' ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposit Assets</h3>
                    
                    {/* Asset Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset</label>
                      <div className="grid grid-cols-3 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-blue-600 font-semibold text-sm">USDC</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">USDC</div>
                            <div className="text-xs text-gray-500">Balance: 10,000</div>
                          </div>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-yellow-600 font-semibold text-sm">WETH</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">WETH</div>
                            <div className="text-xs text-gray-500">Balance: 5.0</div>
                          </div>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-purple-600 font-semibold text-sm">DAI</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">DAI</div>
                            <div className="text-xs text-gray-500">Balance: 2,067</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute right-3 top-3">
                          <span className="text-sm text-gray-500">USDC</span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-gray-600">
                        <span>Available: 10,000 USDC</span>
                        <button className="text-blue-600 hover:text-blue-700">Max</button>
                      </div>
                    </div>

                    {/* Deposit Button */}
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Deposit to Vault
                    </button>

                    {/* Info */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Deposit Information</p>
                          <p className="mt-1">Your assets will be automatically deployed to the highest-yielding strategy. You'll receive vault shares representing your ownership.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Assets</h3>
                    
                    {/* Withdraw Amount */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Withdraw Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute right-3 top-3">
                          <span className="text-sm text-gray-500">Shares</span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-gray-600">
                        <span>Available Shares: 2,456.79</span>
                        <button className="text-blue-600 hover:text-blue-700">Max</button>
                      </div>
                    </div>

                    {/* Withdraw Button */}
                    <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                      Withdraw from Vault
                    </button>

                    {/* Info */}
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="text-sm text-red-800">
                          <p className="font-medium">Withdrawal Information</p>
                          <p className="mt-1">Withdrawing will burn your vault shares and return the equivalent value in assets. This may trigger rebalancing if it affects the vault's asset allocation.</p>
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
                  <span className="text-sm font-mono text-gray-900">0x1234...5678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Depositors</span>
                  <span className="text-sm text-gray-900">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Share Price</span>
                  <span className="text-sm text-gray-900">$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Rebalance</span>
                  <span className="text-sm text-gray-900">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Active Strategies */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Strategies</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Compound Lending</div>
                    <div className="text-xs text-gray-500">Adapter #1</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">12.5% APY</div>
                    <div className="text-xs text-gray-500">40% allocation</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Aave Lending</div>
                    <div className="text-xs text-gray-500">Adapter #2</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">18.7% APY</div>
                    <div className="text-xs text-gray-500">35% allocation</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Yearn Vault</div>
                    <div className="text-xs text-gray-500">Adapter #3</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">14.2% APY</div>
                    <div className="text-xs text-gray-500">25% allocation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-sm">Performance Chart</p>
                  <p className="text-xs">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
