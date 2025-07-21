import axios from 'axios';

export interface AIAssessmentResult {
  score: number;
  approved: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  factors: {
    creditHistory: number;
    collateralRatio: number;
    loanPurpose: number;
    trustTier: number;
    previousLoans: number;
  };
  recommendations: string[];
  confidence: number;
}

export interface BorrowerProfile {
  userId: string;
  name: string;
  trustTier: string;
  aiScore: number;
  requestedAmount: number;
  collateralRatio: string;
  riskLevel: 'low' | 'medium' | 'high';
  loanHistory: any[];
  repaymentHistory: number;
}

class AIService {
  private apiKey = import.meta.env.VITE_AI_API_KEY || 'demo-key';
  private baseURL = import.meta.env.VITE_AI_API_URL || 'https://api.icroots.ai';

  async assessBorrower(borrowerData: {
    amount: number;
    currency: string;
    purpose: string;
    collateralAmount: number;
    trustTier: string;
    previousLoans: number;
    repaymentHistory: number;
  }): Promise<AIAssessmentResult> {
    try {
      // Simulate AI assessment with realistic logic
      const factors = this.calculateFactors(borrowerData);
      const score = this.calculateOverallScore(factors);
      const riskLevel = this.determineRiskLevel(score, factors);
      const approved = score >= 70 && riskLevel !== 'high';
      
      return {
        score,
        approved,
        riskLevel,
        factors,
        recommendations: this.generateRecommendations(factors, score),
        confidence: Math.min(95, 70 + (score / 100) * 25)
      };
    } catch (error) {
      console.error('AI Assessment failed:', error);
      // Fallback assessment
      return this.fallbackAssessment(borrowerData);
    }
  }

  private calculateFactors(data: any) {
    const collateralRatio = (data.collateralAmount * 41667) / data.amount; // Assuming BTC price
    
    return {
      creditHistory: Math.min(100, 60 + (data.repaymentHistory * 40)),
      collateralRatio: Math.min(100, (collateralRatio - 1) * 100),
      loanPurpose: this.scoreLoanPurpose(data.purpose),
      trustTier: this.scoreTrustTier(data.trustTier),
      previousLoans: Math.min(100, data.previousLoans * 20)
    };
  }

  private calculateOverallScore(factors: any): number {
    const weights = {
      creditHistory: 0.3,
      collateralRatio: 0.25,
      loanPurpose: 0.15,
      trustTier: 0.2,
      previousLoans: 0.1
    };

    return Math.round(
      factors.creditHistory * weights.creditHistory +
      factors.collateralRatio * weights.collateralRatio +
      factors.loanPurpose * weights.loanPurpose +
      factors.trustTier * weights.trustTier +
      factors.previousLoans * weights.previousLoans
    );
  }

  private determineRiskLevel(score: number, factors: any): 'low' | 'medium' | 'high' {
    if (score >= 80 && factors.collateralRatio >= 50) return 'low';
    if (score >= 60 && factors.collateralRatio >= 30) return 'medium';
    return 'high';
  }

  private scoreLoanPurpose(purpose: string): number {
    const lowRiskPurposes = ['business expansion', 'education', 'home improvement', 'debt consolidation'];
    const mediumRiskPurposes = ['investment', 'equipment purchase', 'working capital'];
    
    const lowerPurpose = purpose.toLowerCase();
    
    if (lowRiskPurposes.some(p => lowerPurpose.includes(p))) return 85;
    if (mediumRiskPurposes.some(p => lowerPurpose.includes(p))) return 70;
    return 55;
  }

  private scoreTrustTier(tier: string): number {
    const tierScores = {
      'sprout': 40,
      'sapling': 60,
      'branch': 75,
      'trunk': 90,
      'oak': 100
    };
    return tierScores[tier as keyof typeof tierScores] || 40;
  }

  private generateRecommendations(factors: any, score: number): string[] {
    const recommendations = [];
    
    if (factors.creditHistory < 70) {
      recommendations.push('Improve credit history with smaller, successful loans');
    }
    if (factors.collateralRatio < 50) {
      recommendations.push('Consider increasing collateral ratio for better terms');
    }
    if (factors.trustTier < 60) {
      recommendations.push('Build trust tier through consistent repayments');
    }
    if (score >= 80) {
      recommendations.push('Excellent profile - eligible for premium rates');
    }
    
    return recommendations;
  }

  private fallbackAssessment(data: any): AIAssessmentResult {
    const baseScore = 65;
    return {
      score: baseScore,
      approved: baseScore >= 70,
      riskLevel: 'medium',
      factors: {
        creditHistory: 65,
        collateralRatio: 60,
        loanPurpose: 70,
        trustTier: 50,
        previousLoans: 40
      },
      recommendations: ['Complete profile verification', 'Provide additional documentation'],
      confidence: 75
    };
  }

  async getLenderRecommendations(lenderProfile: {
    riskTolerance: 'low' | 'medium' | 'high';
    preferredAmount: number;
    preferredTerm: number;
  }): Promise<BorrowerProfile[]> {
    try {
      // Simulate AI-powered borrower matching
      const mockBorrowers: BorrowerProfile[] = [
        {
          userId: 'borrower1',
          name: 'Michael K.',
          trustTier: 'branch',
          aiScore: 92,
          requestedAmount: 25000,
          collateralRatio: '150%',
          riskLevel: 'low',
          loanHistory: [],
          repaymentHistory: 98
        },
        {
          userId: 'borrower2',
          name: 'Jennifer L.',
          trustTier: 'sapling',
          aiScore: 88,
          requestedAmount: 18000,
          collateralRatio: '160%',
          riskLevel: 'low',
          loanHistory: [],
          repaymentHistory: 95
        },
        {
          userId: 'borrower3',
          name: 'David R.',
          trustTier: 'trunk',
          aiScore: 85,
          requestedAmount: 32000,
          collateralRatio: '140%',
          riskLevel: 'medium',
          loanHistory: [],
          repaymentHistory: 92
        }
      ];

      // Filter based on lender preferences
      return mockBorrowers.filter(borrower => {
        if (lenderProfile.riskTolerance === 'low' && borrower.riskLevel !== 'low') return false;
        if (lenderProfile.riskTolerance === 'medium' && borrower.riskLevel === 'high') return false;
        return borrower.requestedAmount <= lenderProfile.preferredAmount * 1.2;
      });
    } catch (error) {
      console.error('Failed to get lender recommendations:', error);
      return [];
    }
  }

  async updateAIModel(feedbackData: {
    loanId: string;
    actualOutcome: 'success' | 'default';
    predictedRisk: string;
    actualRisk: string;
  }): Promise<boolean> {
    try {
      // In a real implementation, this would update the AI model
      console.log('Updating AI model with feedback:', feedbackData);
      return true;
    } catch (error) {
      console.error('Failed to update AI model:', error);
      return false;
    }
  }
}

export const aiService = new AIService();