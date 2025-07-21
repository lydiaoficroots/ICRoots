import { icpService } from './icpService';
import CryptoJS from 'crypto-js';

export interface WalletData {
  address: string;
  balance: number;
  usdValue: number;
  transactions: Transaction[];
  publicKey?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'locked' | 'released';
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  blockHeight?: number;
}

class WalletService {
  private wallets: Map<string, WalletData> = new Map();
  private btcPrice = 41667; // Mock BTC price in USD

  async generateWallet(userId: string): Promise<WalletData> {
    try {
      // Generate wallet through ICP
      const icpWallet = await icpService.generateBTCWallet(userId);
      
      const walletData: WalletData = {
        address: icpWallet.address,
        balance: 0,
        usdValue: 0,
        transactions: [],
        publicKey: icpWallet.publicKey
      };

      this.wallets.set(userId, walletData);
      return walletData;
    } catch (error) {
      console.error('Failed to generate wallet:', error);
      // Fallback to mock wallet generation
      return this.generateMockWallet(userId);
    }
  }

  private generateMockWallet(userId: string): WalletData {
    // Generate a mock Bitcoin address for development
    const hash = CryptoJS.SHA256(userId + Date.now()).toString();
    const address = 'bc1q' + hash.substring(0, 39);
    
    const walletData: WalletData = {
      address,
      balance: Math.random() * 2, // Random balance for demo
      usdValue: 0,
      transactions: this.generateMockTransactions()
    };

    walletData.usdValue = walletData.balance * this.btcPrice;
    this.wallets.set(userId, walletData);
    return walletData;
  }

  private generateMockTransactions(): Transaction[] {
    return [
      {
        id: 'tx_' + Math.random().toString(36).substr(2, 9),
        type: 'deposit',
        amount: 0.5,
        timestamp: Date.now() - 86400000,
        status: 'confirmed',
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockHeight: 800000 + Math.floor(Math.random() * 1000)
      },
      {
        id: 'tx_' + Math.random().toString(36).substr(2, 9),
        type: 'deposit',
        amount: 0.25,
        timestamp: Date.now() - 172800000,
        status: 'confirmed',
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockHeight: 799500 + Math.floor(Math.random() * 500)
      }
    ];
  }

  async getWallet(userId: string): Promise<WalletData | null> {
    const cached = this.wallets.get(userId);
    if (cached) {
      // Update balance from ICP
      try {
        const balance = await icpService.getBTCBalance(cached.address);
        cached.balance = balance;
        cached.usdValue = balance * this.btcPrice;
        return cached;
      } catch (error) {
        console.error('Failed to update balance:', error);
        return cached;
      }
    }
    return null;
  }

  async refreshBalance(userId: string): Promise<number> {
    const wallet = this.wallets.get(userId);
    if (!wallet) throw new Error('Wallet not found');

    try {
      const balance = await icpService.getBTCBalance(wallet.address);
      wallet.balance = balance;
      wallet.usdValue = balance * this.btcPrice;
      return balance;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      return wallet.balance;
    }
  }

  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    const wallet = this.wallets.get(userId);
    if (!wallet) throw new Error('Wallet not found');

    try {
      const icpTransactions = await icpService.getTransactionHistory(wallet.address);
      const transactions = icpTransactions.map(tx => ({
        id: tx.id,
        type: tx.type as any,
        amount: tx.amount,
        timestamp: tx.timestamp,
        status: tx.status as any
      }));
      
      wallet.transactions = transactions;
      return transactions;
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return wallet.transactions;
    }
  }

  async lockCollateral(userId: string, amount: number, loanId: string): Promise<boolean> {
    const wallet = this.wallets.get(userId);
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('Insufficient balance');

    try {
      const success = await icpService.lockCollateral(wallet.address, amount);
      if (success) {
        // Add transaction record
        const transaction: Transaction = {
          id: 'lock_' + loanId,
          type: 'locked',
          amount: -amount,
          timestamp: Date.now(),
          status: 'confirmed'
        };
        wallet.transactions.unshift(transaction);
        wallet.balance -= amount;
        wallet.usdValue = wallet.balance * this.btcPrice;
      }
      return success;
    } catch (error) {
      console.error('Failed to lock collateral:', error);
      return false;
    }
  }

  async releaseCollateral(userId: string, amount: number, loanId: string): Promise<boolean> {
    const wallet = this.wallets.get(userId);
    if (!wallet) throw new Error('Wallet not found');

    try {
      const success = await icpService.releaseCollateral(loanId);
      if (success) {
        // Add transaction record
        const transaction: Transaction = {
          id: 'release_' + loanId,
          type: 'released',
          amount: amount,
          timestamp: Date.now(),
          status: 'confirmed'
        };
        wallet.transactions.unshift(transaction);
        wallet.balance += amount;
        wallet.usdValue = wallet.balance * this.btcPrice;
      }
      return success;
    } catch (error) {
      console.error('Failed to release collateral:', error);
      return false;
    }
  }

  getBTCPrice(): number {
    return this.btcPrice;
  }

  async updateBTCPrice(): Promise<number> {
    try {
      // In production, fetch from a real API
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await response.json();
      this.btcPrice = parseFloat(data.bpi.USD.rate.replace(',', ''));
      return this.btcPrice;
    } catch (error) {
      console.error('Failed to update BTC price:', error);
      return this.btcPrice;
    }
  }
}

export const walletService = new WalletService();