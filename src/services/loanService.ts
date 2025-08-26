import { v4 as uuidv4 } from 'uuid';
import { icpService } from './icpService';
import { aiService } from './aiService';
import { walletService } from './walletService';

export interface Loan {
  id: string;
  borrowerId: string;
  lenderId?: string;
  amount: number;
  currency: 'USD' | 'USDT';
  collateralAmount: number;
  collateralAddress: string;
  interestRate: number;
  term: number; // months
  purpose: string;
  status: 'pending' | 'approved' | 'funded' | 'active' | 'repaid' | 'defaulted' | 'rejected';
  aiScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: number;
  fundedAt?: number;
  dueDate?: number;
  nextPaymentDate?: number;
  remainingPayments: number;
  totalPaid: number;
  monthlyPayment: number;
  documents: string[];
  repaymentHistory: Payment[];
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  principal: number;
  interest: number;
  date: number;
  status: 'pending' | 'completed' | 'late' | 'failed';
}

export interface LoanApplication {
  amount: number;
  currency: 'USD' | 'USDT';
  purpose: string;
  idDocument: File;
  borrowerId: string;
}

class LoanService {
  private loans: Map<string, Loan> = new Map();
  private applications: Map<string, LoanApplication> = new Map();

  async submitLoanApplication(application: LoanApplication): Promise<{ loanId: string; aiResult: any }> {
    try {
      // Get borrower's wallet and trust info
      const wallet = await walletService.getWallet(application.borrowerId);
      if (!wallet) throw new Error('Wallet not found');

      // Calculate required collateral (150% ratio)
      const btcPrice = walletService.getBTCPrice();
      const requiredCollateral = (application.amount * 1.5) / btcPrice;

      if (wallet.balance < requiredCollateral) {
        throw new Error('Insufficient collateral');
      }

      // Get AI assessment
      const aiResult = await aiService.assessBorrower({
        amount: application.amount,
        currency: application.currency,
        purpose: application.purpose,
        collateralAmount: requiredCollateral,
        trustTier: 'sapling', // This would come from user profile
        previousLoans: 0, // This would come from user history
        repaymentHistory: 100 // This would come from user history
      });

      // Create loan record
      const loanId = uuidv4();
      const loan: Loan = {
        id: loanId,
        borrowerId: application.borrowerId,
        amount: application.amount,
        currency: application.currency,
        collateralAmount: requiredCollateral,
        collateralAddress: wallet.address,
        interestRate: this.calculateInterestRate(aiResult.score, aiResult.riskLevel),
        term: 12, // Default 12 months
        purpose: application.purpose,
        status: aiResult.approved ? 'approved' : 'rejected',
        aiScore: aiResult.score,
        riskLevel: aiResult.riskLevel,
        createdAt: Date.now(),
        remainingPayments: 12,
        totalPaid: 0,
        monthlyPayment: 0,
        documents: [],
        repaymentHistory: []
      };

      // Calculate monthly payment
      loan.monthlyPayment = this.calculateMonthlyPayment(
        loan.amount,
        loan.interestRate,
        loan.term
      );

      if (aiResult.approved) {
        // Lock collateral
        await walletService.lockCollateral(
          application.borrowerId,
          requiredCollateral,
          loanId
        );

        // Create loan on ICP
        await icpService.createLoan({
          userId: application.borrowerId,
          amount: application.amount,
          currency: application.currency,
          collateralAddress: wallet.address,
          collateralAmount: requiredCollateral,
          purpose: application.purpose,
          aiScore: aiResult.score
        });
      }

      this.loans.set(loanId, loan);
      this.applications.set(loanId, application);

      return { loanId, aiResult };
    } catch (error) {
      console.error('Failed to submit loan application:', error);
      throw error;
    }
  }

  private calculateInterestRate(aiScore: number, riskLevel: string): number {
    let baseRate = 8.0; // Base rate 8%
    
    // Adjust based on AI score
    if (aiScore >= 90) baseRate -= 2.0;
    else if (aiScore >= 80) baseRate -= 1.5;
    else if (aiScore >= 70) baseRate -= 1.0;
    else if (aiScore >= 60) baseRate -= 0.5;
    else baseRate += 1.0;

    // Adjust based on risk level
    switch (riskLevel) {
      case 'low': baseRate -= 0.5; break;
      case 'high': baseRate += 1.5; break;
    }

    return Math.max(5.0, Math.min(15.0, baseRate)); // Cap between 5% and 15%
  }

  private calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    return Math.round(payment * 100) / 100;
  }

  async fundLoan(loanId: string, lenderId: string, amount: number): Promise<boolean> {
    try {
      const loan = this.loans.get(loanId);
      if (!loan) throw new Error('Loan not found');
      if (loan.status !== 'approved') throw new Error('Loan not available for funding');

      // Update loan status
      loan.lenderId = lenderId;
      loan.status = 'funded';
      loan.fundedAt = Date.now();
      loan.dueDate = Date.now() + (loan.term * 30 * 24 * 60 * 60 * 1000);
      loan.nextPaymentDate = Date.now() + (30 * 24 * 60 * 60 * 1000);

      // In a real implementation, transfer funds to borrower
      console.log(`Funding loan ${loanId} with ${amount} ${loan.currency}`);

      // Update loan status to active
      loan.status = 'active';

      return true;
    } catch (error) {
      console.error('Failed to fund loan:', error);
      return false;
    }
  }

  async makePayment(loanId: string, amount: number): Promise<boolean> {
    try {
      const loan = this.loans.get(loanId);
      if (!loan) throw new Error('Loan not found');
      if (loan.status !== 'active') throw new Error('Loan not active');

      const payment: Payment = {
        id: uuidv4(),
        loanId,
        amount,
        principal: amount * 0.8, // Simplified calculation
        interest: amount * 0.2,
        date: Date.now(),
        status: 'completed'
      };

      loan.repaymentHistory.push(payment);
      loan.totalPaid += amount;
      loan.remainingPayments -= 1;

      // Update next payment date
      if (loan.remainingPayments > 0) {
        loan.nextPaymentDate = Date.now() + (30 * 24 * 60 * 60 * 1000);
      } else {
        // Loan fully repaid
        loan.status = 'repaid';
        loan.nextPaymentDate = undefined;
        
        // Release collateral
        await walletService.releaseCollateral(
          loan.borrowerId,
          loan.collateralAmount,
          loanId
        );
      }

      return true;
    } catch (error) {
      console.error('Failed to make payment:', error);
      return false;
    }
  }

  getLoan(loanId: string): Loan | undefined {
    return this.loans.get(loanId);
  }

  getBorrowerLoans(borrowerId: string): Loan[] {
    return Array.from(this.loans.values()).filter(loan => loan.borrowerId === borrowerId);
  }

  getLenderLoans(lenderId: string): Loan[] {
    return Array.from(this.loans.values()).filter(loan => loan.lenderId === lenderId);
  }

  getAvailableLoans(): Loan[] {
    return Array.from(this.loans.values()).filter(loan => loan.status === 'approved');
  }

  async getRecommendedBorrowers(lenderId: string): Promise<Loan[]> {
    try {
      // Get lender preferences (this would come from lender profile)
      const lenderProfile = {
        riskTolerance: 'medium' as const,
        preferredAmount: 50000,
        preferredTerm: 12
      };

      const recommendations = await aiService.getLenderRecommendations(lenderProfile);
      
      // Convert AI recommendations to loan format
      return recommendations.map(borrower => ({
        id: uuidv4(),
        borrowerId: borrower.userId,
        amount: borrower.requestedAmount,
        currency: 'USD' as const,
        collateralAmount: 0,
        collateralAddress: '',
        interestRate: this.calculateInterestRate(borrower.aiScore, borrower.riskLevel),
        term: 12,
        purpose: 'Business expansion',
        status: 'approved' as const,
        aiScore: borrower.aiScore,
        riskLevel: borrower.riskLevel,
        createdAt: Date.now(),
        remainingPayments: 12,
        totalPaid: 0,
        monthlyPayment: 0,
        documents: [],
        repaymentHistory: [],
        borrowerName: borrower.name,
        trustTier: borrower.trustTier,
        collateralRatio: borrower.collateralRatio
      }));
    } catch (error) {
      console.error('Failed to get recommended borrowers:', error);
      return [];
    }
  }

  // Generate mock loan history for development
  generateMockLoans(userId: string, isLender: boolean = false): Loan[] {
    const mockLoans: Loan[] = [
      {
        id: 'LN001',
        borrowerId: isLender ? 'borrower1' : userId,
        lenderId: isLender ? userId : 'lender1',
        amount: 25000,
        currency: 'USD',
        collateralAmount: 0.6,
        collateralAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        interestRate: 8.5,
        term: 12,
        purpose: 'Business expansion',
        status: 'repaid',
        aiScore: 92,
        riskLevel: 'low',
        createdAt: Date.now() - 86400000 * 30,
        fundedAt: Date.now() - 86400000 * 29,
        remainingPayments: 0,
        totalPaid: 27125,
        monthlyPayment: 2260,
        documents: [],
        repaymentHistory: []
      },
      {
        id: 'LN002',
        borrowerId: isLender ? 'borrower2' : userId,
        lenderId: isLender ? userId : 'lender2',
        amount: 18000,
        currency: 'USDT',
        collateralAmount: 0.45,
        collateralAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        interestRate: 7.2,
        term: 18,
        purpose: 'Equipment purchase',
        status: 'active',
        aiScore: 88,
        riskLevel: 'low',
        createdAt: Date.now() - 86400000 * 10,
        fundedAt: Date.now() - 86400000 * 9,
        dueDate: Date.now() + 86400000 * 540,
        nextPaymentDate: Date.now() + 86400000 * 20,
        remainingPayments: 15,
        totalPaid: 3240,
        monthlyPayment: 1080,
        documents: [],
        repaymentHistory: []
      }
    ];

    mockLoans.forEach(loan => this.loans.set(loan.id, loan));
    return mockLoans;
  }
}

export const loanService = new LoanService();