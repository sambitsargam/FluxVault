'use client';

import { useState } from 'react';

export default function Adapters() {
  const [selectedAdapter, setSelectedAdapter] = useState(null);

  const adapters = [
    {
      id: 1,
      name: 'Compound Lending',
      address: '0x1234...5678',
      apy: 12.5,
      tvl: '$15,234,567',
      status: 'active',
      risk: 'low',
      description: 'Lend USDC on Compound protocol with competitive rates',
      assets: ['USDC', 'USDT', 'DAI'],
      lastUpdate: '2 hours ago'
    },
    {
      id: 2,
      name: 'Aave Lending',
      address: '0x2345...6789',
      apy: 18.7,
      tvl: '$23,456,789',
      status: 'active',
      risk: 'medium',
      description: 'Advanced lending protocol with multiple asset support',
      assets: ['WETH', 'USDC', 'DAI', 'USDT'],
      lastUpdate: '1 hour ago'
    },
    {
      id: 3,
      name: 'Yearn Vault',
      address: '0x3456...7890',
      apy: 14.2,
      tvl: '$8,765,432',
      status: 'active',
      risk: 'low',
      description: 'Automated yield farming strategies with risk management',
      assets: ['DAI', 'USDC'],
      lastUpdate: '3 hours ago'
    },
    {
      id: 4,
      name: 'Uniswap V3 LP',
      address: '0x4567...8901',
      apy: 22.3,
      tvl: '$12,345,678',
      status: 'pending',
      risk: 'high',
      description: 'Liquidity provision on Uniswap V3 with concentrated liquidity',
      assets: ['WETH', 'USDC'],
      lastUpdate: '5 hours ago'
    }
  ];

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
              <a href="/vault" className="text-gray-600 hover:text-blue-600 transition-colors">Vault</a>
              <a href="/adapters" className="text-blue-600 font-medium">Adapters</a>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lending Adapters</h1>
              <p className="text-gray-600">Manage and monitor yield farming strategies across different protocols</p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Add New Adapter
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Adapters</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Adapters</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
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
                <p className="text-sm font-medium text-gray-600">Avg APY</p>
                <p className="text-2xl font-bold text-gray-900">16.9%</p>
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
                <p className="text-sm font-medium text-gray-600">Total TVL</p>
                <p className="text-2xl font-bold text-gray-900">$59.8M</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Adapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adapters.map((adapter) => (
            <div
              key={adapter.id}
              className={`bg-white rounded-lg shadow cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedAdapter === adapter.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedAdapter(selectedAdapter === adapter.id ? null : adapter.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{adapter.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">{adapter.address}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      adapter.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {adapter.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      adapter.risk === 'low' 
                        ? 'bg-green-100 text-green-800' 
                        : adapter.risk === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {adapter.risk} risk
                    </span>
                  </div>
                </div>

                {/* APY */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-green-600">{adapter.apy}%</div>
                  <div className="text-sm text-gray-500">Current APY</div>
                </div>

                {/* TVL */}
                <div className="mb-4">
                  <div className="text-lg font-semibold text-gray-900">{adapter.tvl}</div>
                  <div className="text-sm text-gray-500">Total Value Locked</div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{adapter.description}</p>

                {/* Supported Assets */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Supported Assets</div>
                  <div className="flex flex-wrap gap-1">
                    {adapter.assets.map((asset, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Update */}
                <div className="text-xs text-gray-500 mb-4">
                  Last updated: {adapter.lastUpdate}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Adapter Details Modal (when selected) */}
        {selectedAdapter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {adapters.find(a => a.id === selectedAdapter)?.name} Details
                  </h2>
                  <button
                    onClick={() => setSelectedAdapter(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Performance Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {adapters.find(a => a.id === selectedAdapter)?.apy}%
                        </div>
                        <div className="text-sm text-gray-600">Current APY</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {adapters.find(a => a.id === selectedAdapter)?.tvl}
                        </div>
                        <div className="text-sm text-gray-600">Total Value Locked</div>
                      </div>
                    </div>
                  </div>

                  {/* Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected APY</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="15.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adapter Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="My Custom Adapter"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Save Configuration
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      Enable Adapter
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                      Disable Adapter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
