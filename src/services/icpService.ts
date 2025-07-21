import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

// ICP Canister Interface
export interface ICPCanister {
  generateBTCWallet: (userId: string) => Promise<{ address: string; publicKey: string }>;
  getBTCBalance: (address: string) => Promise<number>;
  createLoan: (loanData: any) => Promise<string>;
  updateTrustScore: (userId: string, score: number) => Promise<boolean>;
  mintTrustNFT: (userId: string, tier: string) => Promise<string>;
  getTransactionHistory: (address: string) => Promise<any[]>;
  lockCollateral: (address: string, amount: number) => Promise<boolean>;
  releaseCollateral: (loanId: string) => Promise<boolean>;
}

class ICPService {
  private agent: HttpAgent | null = null;
  private authClient: AuthClient | null = null;
  private actor: ICPCanister | null = null;
  private canisterId = import.meta.env.VITE_CANISTER_ID || 'rdmx6-jaaaa-aaaah-qdrqq-cai';

  async initialize() {
    try {
      this.authClient = await AuthClient.create();
      
      // Create agent
      this.agent = new HttpAgent({
        host: import.meta.env.PROD 
          ? 'https://ic0.app' 
          : 'http://localhost:8000'
      });

      // In development, fetch root key
      if (!import.meta.env.PROD) {
        await this.agent.fetchRootKey();
      }

      // Create actor
      this.actor = Actor.createActor(this.getIDL(), {
        agent: this.agent,
        canisterId: this.canisterId,
      }) as ICPCanister;

      return true;
    } catch (error) {
      console.error('Failed to initialize ICP service:', error);
      return false;
    }
  }

  private getIDL() {
    // Candid interface definition for the canister
    return ({ IDL }: any) => {
      return IDL.Service({
        generateBTCWallet: IDL.Func([IDL.Text], [IDL.Record({ address: IDL.Text, publicKey: IDL.Text })], []),
        getBTCBalance: IDL.Func([IDL.Text], [IDL.Float64], ['query']),
        createLoan: IDL.Func([IDL.Record({
          userId: IDL.Text,
          amount: IDL.Float64,
          currency: IDL.Text,
          collateralAddress: IDL.Text,
          collateralAmount: IDL.Float64,
          purpose: IDL.Text,
          aiScore: IDL.Nat,
        })], [IDL.Text], []),
        updateTrustScore: IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
        mintTrustNFT: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
        getTransactionHistory: IDL.Func([IDL.Text], [IDL.Vec(IDL.Record({
          id: IDL.Text,
          type: IDL.Text,
          amount: IDL.Float64,
          timestamp: IDL.Int,
          status: IDL.Text,
        }))], ['query']),
        lockCollateral: IDL.Func([IDL.Text, IDL.Float64], [IDL.Bool], []),
        releaseCollateral: IDL.Func([IDL.Text], [IDL.Bool], []),
      });
    };
  }

  async login() {
    if (!this.authClient) await this.initialize();
    
    return new Promise<boolean>((resolve) => {
      this.authClient?.login({
        identityProvider: import.meta.env.PROD 
          ? 'https://identity.ic0.app' 
          : `http://localhost:8000?canisterId=${import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID}`,
        onSuccess: () => resolve(true),
        onError: () => resolve(false),
      });
    });
  }

  async logout() {
    await this.authClient?.logout();
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) await this.initialize();
    return await this.authClient?.isAuthenticated() || false;
  }

  async generateBTCWallet(userId: string) {
    if (!this.actor) throw new Error('ICP service not initialized');
    return await this.actor.generateBTCWallet(userId);
  }

  async getBTCBalance(address: string): Promise<number> {
    if (!this.actor) throw new Error('ICP service not initialized');
    try {
      return await this.actor.getBTCBalance(address);
    } catch (error) {
      console.error('Error fetching BTC balance:', error);
      // Return mock data for development
      return Math.random() * 2;
    }
  }

  async createLoan(loanData: any): Promise<string> {
    if (!this.actor) throw new Error('ICP service not initialized');
    return await this.actor.createLoan(loanData);
  }

  async updateTrustScore(userId: string, score: number): Promise<boolean> {
    if (!this.actor) throw new Error('ICP service not initialized');
    return await this.actor.updateTrustScore(userId, score);
  }

  async mintTrustNFT(userId: string, tier: string): Promise<string> {
    if (!this.actor) throw new Error('ICP service not initialized');
    return await this.actor.mintTrustNFT(userId, tier);
  }

  async getTransactionHistory(address: string) {
    if (!this.actor) throw new Error('ICP service not initialized');
    try {
      return await this.actor.getTransactionHistory(address);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      // Return mock data for development
      return [
        {
          id: 'tx1',
          type: 'deposit',
          amount: 0.5,
          timestamp: Date.now() - 86400000,
          status: 'confirmed'
        },
        {
          id: 'tx2',
          type: 'deposit',
          amount: 0.25,
          timestamp: Date.now() - 172800000,
          status: 'confirmed'
        }
      ];
    }
  }

  async lockCollateral(address: string, amount: number): Promise<boolean> {
    if (!this.actor) throw new Error('ICP service not initialized');
    return await this.actor.lockCollateral(address, amount);
  }

  async releaseCollateral(loanId: string): Promise<boolean> {
    if (!this.actor) throw new Error('ICP service not initialized');
    return await this.actor.releaseCollateral(loanId);
  }
}

export const icpService = new ICPService();