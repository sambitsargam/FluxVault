'use client';

import { useState } from 'react';

export default function Rebalancer() {
  const [activeTab, setActiveTab] = useState('monitor');

  const rebalanceHistory = [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:00',
      trigger: 'APY Threshold Met',
      fromAdapter: 'Compound Lending',
      toAdapter: 'Aave Lending',
      triggerAPY: 12.5,
      newAPY: 18.7,
      vault: 'Origin Vault',
      status: 'completed',
      gasUsed: '125,000'
    },
    {
      id: 2,
      timestamp: '2024-01-15 10:15:00',
      trigger: 'Market Conditions',
      fromAdapter: 'Yearn Vault',
      toAdapter: 'Compound Lending',
      triggerAPY: 14.2,
      newAPY: 12.5,
      vault: 'Origin Vault',
      status: 'completed',
      gasUsed: '98,000'
    },
    {
      id: 3,
      timestamp: '2024-01-14 16:45:00',
      trigger: 'Manual Trigger',
      fromAdapter: 'Aave Lending',
      toAdapter: 'Yearn Vault',
      triggerAPY: 18.7,
      newAPY: 14.2,
      vault: 'Origin Vault',
      status: 'completed',
      gasUsed: '156,000'
    }
  ];

  const watchers = [
    {
      id: 1,
      name: 'StrategyWatcher #1',
      targetAdapter: 'Compound Lending',
      chainId: 1,
      status: 'active',
      lastTrigger: '2 hours ago',
      thresholds: {
        min: '3%',
        max: '10%',
        rebalance: '2%'
      }
    },
    {
      id: 2,
      name: 'StrategyWatcher #2',
      targetAdapter: 'Aave Lending',
      chainId: 1,
      status: 'active',
      lastTrigger: '1 hour ago',
      thresholds: {
        min: '3%',
        max: '10%',
        rebalance: '2%'
      }
    },
    {
      id: 3,
      name: 'StrategyWatcher #3',
      targetAdapter: 'Yearn Vault',
      chainId: 137,
      status: 'inactive',
      lastTrigger: 'Never',
      thresholds: {
        min: '3%',
        max: '10%',
        rebalance: '2%'
      }
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
              <a href="/adapters" className="text-gray-600 hover:text-blue-600 transition-colors">Adapters</a>
              <a href="/rebalancer" className="text-blue-600 font-medium">Rebalancer</a>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rebalancer System</h1>
          <p className="text-gray-600">Monitor and manage automatic rebalancing operations powered by Reactive Smart Contracts</p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
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
                <p className="text-sm font-medium text-gray-600">Active Watchers</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rebalances Today</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gas Saved</p>
                <p className="text-2xl font-bold text-gray-900">45%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('monitor')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'monitor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Monitor
              </button>
              <button
                onClick={() => setActiveTab('watchers')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'watchers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Strategy Watchers
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'monitor' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Real-time Monitoring</h2>
                
                {/* Current Adapter Performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Compound Lending</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current APY</span>
                        <span className="text-sm font-medium text-gray-900">12.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Allocation</span>
                        <span className="text-sm font-medium text-gray-900">40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Stable
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Aave Lending</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current APY</span>
                        <span className="text-sm font-medium text-gray-900">18.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Allocation</span>
                        <span className="text-sm font-medium text-gray-900">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Optimizing
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Yearn Vault</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current APY</span>
                        <span className="text-sm font-medium text-gray-900">14.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Allocation</span>
                        <span className="text-sm font-medium text-gray-900">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Stable
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rebalancing Triggers */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Rebalancing Opportunity Detected</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Uniswap V3 LP adapter shows 22.3% APY. Consider rebalancing from Yearn Vault (14.2% APY) to capture higher yield.
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                          Execute Rebalancing
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'watchers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Strategy Watchers</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Add New Watcher
                  </button>
                </div>

                <div className="space-y-4">
                  {watchers.map((watcher) => (
                    <div key={watcher.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{watcher.name}</h3>
                          <p className="text-sm text-gray-600">Monitoring: {watcher.targetAdapter}</p>
                          <p className="text-sm text-gray-500">Chain ID: {watcher.chainId}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            watcher.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {watcher.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Min Threshold</div>
                          <div className="text-lg font-semibold text-gray-900">{watcher.thresholds.min}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Max Threshold</div>
                          <div className="text-lg font-semibold text-gray-900">{watcher.thresholds.max}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Rebalance Threshold</div>
                          <div className="text-lg font-semibold text-gray-900">{watcher.thresholds.rebalance}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Last Trigger</div>
                          <div className="text-lg font-semibold text-gray-900">{watcher.lastTrigger}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Configure
                        </button>
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          watcher.status === 'active'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}>
                          {watcher.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Rebalancing History</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From → To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY Change</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vault</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rebalanceHistory.map((rebalance) => (
                        <tr key={rebalance.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rebalance.timestamp}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rebalance.trigger}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{rebalance.fromAdapter}</div>
                            <div className="text-sm text-gray-500">→ {rebalance.toAdapter}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{rebalance.triggerAPY}% → {rebalance.newAPY}%</div>
                            <div className="text-sm text-green-600">+{(rebalance.newAPY - rebalance.triggerAPY).toFixed(1)}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rebalance.vault}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {rebalance.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Rebalancer Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Rebalance Interval</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>4 hours</option>
                        <option>6 hours</option>
                        <option>12 hours</option>
                        <option>24 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Gas Price</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum gas price in Gwei for rebalancing operations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">APY Weight</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="70"
                      />
                      <p className="text-xs text-gray-500 mt-1">Weight given to APY in scoring (0-100)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stability Weight</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Weight given to stability in scoring (0-100)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Liquidity Weight</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10"
                      />
                      <p className="text-xs text-gray-500 mt-1">Weight given to liquidity in scoring (0-100)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Emergency Mode</h4>
                      <p className="text-sm text-blue-700">Disable all automatic rebalancing operations</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      Enable Emergency Mode
                    </button>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                      Reset to Defaults
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
