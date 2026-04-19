import React from 'react';
import Layout from '../../components/Layout';
import WalletConnect from '../../components/WalletConnect';
import useThemeHue from '../../hooks/useThemeHue';

export default function BlockchainIntegration() {
  const { themeColor } = useThemeHue();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <a href="/technology" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Back to Technology
            </a>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Technology</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Blockchain Integration</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Connect Ethereum wallets, interact with smart contracts, and build Web3 experiences.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Wallet Connection</h3>
              <p className="text-white/60">MetaMask, WalletConnect, and Coinbase Wallet integration.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Contracts</h3>
              <p className="text-white/60">Read and write to Ethereum smart contracts with viem.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Token Integration</h3>
              <p className="text-white/60">ERC-20, ERC-721 (NFT), and ERC-1155 token standards.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Chain</h3>
              <p className="text-white/60">Ethereum, Base, Arbitrum, and testnet support.</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Connect Your Wallet</h2>
            <div className="max-w-md mx-auto">
              <WalletConnect />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Supported Networks</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border border-white/10 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-xs font-bold">ETH</span>
                  </div>
                  <span className="text-white">Ethereum Mainnet</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-white/10 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <span className="text-blue-500 text-xs font-bold">BASE</span>
                  </div>
                  <span className="text-white">Base</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-white/10 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-300/20 flex items-center justify-center">
                    <span className="text-blue-300 text-xs font-bold">ARB</span>
                  </div>
                  <span className="text-white">Arbitrum One</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-white/10 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-xs font-bold">TEST</span>
                  </div>
                  <span className="text-white">Sepolia Testnet</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}