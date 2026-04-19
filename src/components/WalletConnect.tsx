import React from 'react';
import { useWallet, formatAddress, formatBalance, getChainById } from '../lib/wallet';

export default function WalletConnect() {
  const { wallet, connect, disconnect, isConnecting, error } = useWallet();

  if (wallet.isConnected) {
    const chain = getChainById(wallet.chainId || 0);

    return (
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">{formatAddress(wallet.address || '')}</div>
              <div className="text-white/40 text-xs">{chain?.name || `Chain ${wallet.chainId}`}</div>
            </div>
          </div>
          <button
            onClick={disconnect}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Disconnect
          </button>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-white/10">
          <span className="text-white/60 text-sm">Balance</span>
          <span className="text-white font-medium">{formatBalance(wallet.balance)} ETH</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0082D8]/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-white font-bold mb-2">Connect Wallet</h3>
      <p className="text-white/60 text-sm mb-4">Connect your Ethereum wallet to interact with blockchain features.</p>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={connect}
        disabled={isConnecting}
        className="w-full bg-[#0082D8] hover:bg-[#0082D8]/80 disabled:bg-[#0082D8]/50 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      
      <p className="text-white/40 text-xs mt-4">Supported: MetaMask, Coinbase Wallet, Trust Wallet</p>
    </div>
  );
}