import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
}

interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('No Ethereum wallet found. Please install MetaMask.');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts.length > 0) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        }) as string;

        setWallet({
          isConnected: true,
          address: accounts[0],
          chainId: parseInt(chainId, 16),
          balance: (parseInt(balance, 16) / 1e18).toFixed(4),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
    });
    setError(null);
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, isConnecting, error }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum Mainnet', symbol: 'ETH', explorer: 'https://etherscan.io' },
  { id: 5, name: 'Goerli Testnet', symbol: 'ETH', explorer: 'https://goerli.etherscan.io' },
  { id: 11155111, name: 'Sepolia Testnet', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io' },
  { id: 8453, name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org' },
  { id: 42161, name: 'Arbitrum One', symbol: 'ETH', explorer: 'https://arbiscan.io' },
];

export function getChainById(chainId: number) {
  return SUPPORTED_CHAINS.find(c => c.id === chainId);
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: string | null): string {
  if (!balance) return '0.0000';
  return parseFloat(balance).toFixed(4);
}