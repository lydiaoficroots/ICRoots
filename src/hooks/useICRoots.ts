import { useState, useEffect, useCallback } from 'react';
import { icpService } from '../services/icpService';
import { walletService, WalletData } from '../services/walletService';
import { loanService, Loan } from '../services/loanService';
import { trustService, TrustProfile } from '../services/trustService';
import { aiService } from '../services/aiService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'borrower' | 'lender';
  isAuthenticated: boolean;
}

export const useICRoots = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [trustProfile, setTrustProfile] = useState<TrustProfile | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await icpService.initialize();
        await walletService.updateBTCPrice();
      } catch (error) {
        console.error('Failed to initialize services:', error);
        // Don't set error state for initialization failures
      }
    };

    initializeServices();
  }, []);

  // Authentication
  const login = useCallback(async (email: string, password: string, role: 'borrower' | 'lender') => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock authentication - in production, this would validate credentials
      const userId = `user_${Date.now()}`;
      const newUser: User = {
        id: userId,
        email,
        name: email.split('@')[0],
        role,
        isAuthenticated: true
      };

      setUser(newUser);

      // Initialize user data based on role
      if (role === 'borrower') {
        // Generate wallet
        const walletData = await walletService.generateWallet(userId);
        setWallet(walletData);

        // Initialize trust profile
        const profile = trustService.generateMockProfile(userId, 'sapling');
        setTrustProfile(profile);

        // Load loan history
        const userLoans = loanService.generateMockLoans(userId, false);
        setLoans(userLoans);
      } else {
        // For lenders, load funded loans
        const lenderLoans = loanService.generateMockLoans(userId, true);
        setLoans(lenderLoans);
      }

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setWallet(null);
    setTrustProfile(null);
    setLoans([]);
    await icpService.logout();
  }, []);

  // Wallet operations
  const refreshWallet = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedWallet = await walletService.getWallet(user.id);
      if (updatedWallet) {
        setWallet(updatedWallet);
      }
    } catch (error) {
      console.error('Failed to refresh wallet:', error);
      setError('Failed to refresh wallet');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getTransactionHistory = useCallback(async () => {
    if (!user) return [];
    
    try {
      return await walletService.getTransactionHistory(user.id);
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }, [user]);

  // Loan operations
  const submitLoanApplication = useCallback(async (applicationData: {
    amount: number;
    currency: 'USD' | 'USDT';
    purpose: string;
    idDocument: File;
  }) => {
    if (!user || user.role !== 'borrower') throw new Error('Invalid user');
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await loanService.submitLoanApplication({
        ...applicationData,
        borrowerId: user.id
      });

      // Refresh loans
      const updatedLoans = loanService.getBorrowerLoans(user.id);
      setLoans(updatedLoans);

      // Update trust profile if loan was approved
      if (result.aiResult.approved && trustProfile) {
        const updatedProfile = await trustService.updateTrustScore(user.id, {
          amount: applicationData.amount,
          onTime: true,
          completed: false
        });
        setTrustProfile(updatedProfile);
      }

      return result;
    } catch (error) {
      console.error('Failed to submit loan application:', error);
      setError('Failed to submit loan application');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, trustProfile]);

  const fundLoan = useCallback(async (loanId: string, amount: number) => {
    if (!user || user.role !== 'lender') throw new Error('Invalid user');
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await loanService.fundLoan(loanId, user.id, amount);
      
      if (success) {
        // Refresh loans
        const updatedLoans = loanService.getLenderLoans(user.id);
        setLoans(updatedLoans);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to fund loan:', error);
      setError('Failed to fund loan');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const makePayment = useCallback(async (loanId: string, amount: number) => {
    if (!user || user.role !== 'borrower') throw new Error('Invalid user');
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await loanService.makePayment(loanId, amount);
      
      if (success) {
        // Refresh loans
        const updatedLoans = loanService.getBorrowerLoans(user.id);
        setLoans(updatedLoans);

        // Update trust profile
        if (trustProfile) {
          const updatedProfile = await trustService.updateTrustScore(user.id, {
            amount,
            onTime: true,
            completed: true
          });
          setTrustProfile(updatedProfile);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Failed to make payment:', error);
      setError('Failed to make payment');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, trustProfile]);

  // AI operations
  const getAIRecommendations = useCallback(async () => {
    if (!user || user.role !== 'lender') return [];
    
    try {
      const recommendations = await loanService.getRecommendedBorrowers(user.id);
      return recommendations;
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      return [];
    }
  }, [user]);

  const getAIAssessment = useCallback(async (loanData: any) => {
    try {
      return await aiService.assessBorrower(loanData);
    } catch (error) {
      console.error('Failed to get AI assessment:', error);
      throw error;
    }
  }, []);

  // Trust operations
  const refreshTrustProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const profile = await trustService.getTrustProfile(user.id);
      setTrustProfile(profile);
    } catch (error) {
      console.error('Failed to refresh trust profile:', error);
    }
  }, [user]);

  return {
    // State
    user,
    wallet,
    trustProfile,
    loans,
    loading,
    error,
    
    // Authentication
    login,
    logout,
    
    // Wallet operations
    refreshWallet,
    getTransactionHistory,
    
    // Loan operations
    submitLoanApplication,
    fundLoan,
    makePayment,
    
    // AI operations
    getAIRecommendations,
    getAIAssessment,
    
    // Trust operations
    refreshTrustProfile,
    
    // Utilities
    clearError: () => setError(null)
  };
};