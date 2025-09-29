'use client'

import { createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { lasna } from '../config/contracts'

// Create wagmi config with proper connectors
const config = createConfig({
  chains: [lasna, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo' }),
    coinbaseWallet({
      appName: 'FluxVault',
      appLogoUrl: 'https://example.com/logo.png',
    }),
  ],
  transports: {
    [lasna.id]: http(lasna.rpcUrls.default.http[0]),
    [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
  },
})

// Create query client
const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export { config }