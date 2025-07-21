import { icpService } from './icpService';

export interface TrustProfile {
  userId: string;
  tier: 'sprout' | 'sapling' | 'branch' | 'trunk' | 'oak';
  score: number;
  nftTokenId?: string;
  achievements: Achievement[];
  metrics: TrustMetrics;
  lastUpdated: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: number;
  points: number;
}

export interface TrustMetrics {
  totalLoans: number;
  successfulRepayments: number;
  onTimePaymentRate: number;
  totalBorrowed: number;
  totalRepaid: number;
  averageLoanSize: number;
  daysSinceFirstLoan: number;
}

class TrustService {
  private profiles: Map<string, TrustProfile> = new Map();

  async initializeTrustProfile(userId: string): Promise<TrustProfile> {
    const profile: TrustProfile = {
      userId,
      tier: 'sprout',
      score: 40,
      achievements: [],
      metrics: {
        totalLoans: 0,
        successfulRepayments: 0,
        onTimePaymentRate: 100,
        totalBorrowed: 0,
        totalRepaid: 0,
        averageLoanSize: 0,
        daysSinceFirstLoan: 0
      },
      lastUpdated: Date.now()
    };

    // Mint initial NFT
    try {
      const nftTokenId = await icpService.mintTrustNFT(userId, 'sprout');
      profile.nftTokenId = nftTokenId;
    } catch (error) {
      console.error('Failed to mint initial NFT:', error);
    }

    this.profiles.set(userId, profile);
    return profile;
  }

  async getTrustProfile(userId: string): Promise<TrustProfile> {
    let profile = this.profiles.get(userId);
    if (!profile) {
      profile = await this.initializeTrustProfile(userId);
    }
    return profile;
  }

  async updateTrustScore(userId: string, loanData: {
    amount: number;
    onTime: boolean;
    completed: boolean;
  }): Promise<TrustProfile> {
    const profile = await this.getTrustProfile(userId);
    
    // Update metrics
    if (loanData.completed) {
      profile.metrics.totalLoans += 1;
      profile.metrics.totalBorrowed += loanData.amount;
      profile.metrics.totalRepaid += loanData.amount;
      
      if (loanData.onTime) {
        profile.metrics.successfulRepayments += 1;
      }
      
      profile.metrics.onTimePaymentRate = 
        (profile.metrics.successfulRepayments / profile.metrics.totalLoans) * 100;
      
      profile.metrics.averageLoanSize = 
        profile.metrics.totalBorrowed / profile.metrics.totalLoans;
    }

    // Calculate new trust score
    profile.score = this.calculateTrustScore(profile.metrics);
    
    // Check for tier upgrade
    const newTier = this.determineTier(profile.score, profile.metrics);
    if (newTier !== profile.tier) {
      await this.upgradeTier(profile, newTier);
    }

    // Check for new achievements
    await this.checkAchievements(profile);

    profile.lastUpdated = Date.now();
    
    // Update on ICP
    try {
      await icpService.updateTrustScore(userId, profile.score);
    } catch (error) {
      console.error('Failed to update trust score on ICP:', error);
    }

    this.profiles.set(userId, profile);
    return profile;
  }

  private calculateTrustScore(metrics: TrustMetrics): number {
    let score = 40; // Base score for sprout

    // Loan completion bonus
    score += Math.min(30, metrics.totalLoans * 5);

    // On-time payment rate bonus
    score += (metrics.onTimePaymentRate / 100) * 20;

    // Experience bonus
    if (metrics.daysSinceFirstLoan > 365) score += 10;
    if (metrics.daysSinceFirstLoan > 730) score += 5;

    // Volume bonus
    if (metrics.totalBorrowed > 50000) score += 5;
    if (metrics.totalBorrowed > 100000) score += 5;

    return Math.min(100, Math.round(score));
  }

  private determineTier(score: number, metrics: TrustMetrics): TrustProfile['tier'] {
    if (score >= 90 && metrics.totalLoans >= 10) return 'oak';
    if (score >= 80 && metrics.totalLoans >= 7) return 'trunk';
    if (score >= 70 && metrics.totalLoans >= 4) return 'branch';
    if (score >= 60 && metrics.totalLoans >= 2) return 'sapling';
    return 'sprout';
  }

  private async upgradeTier(profile: TrustProfile, newTier: TrustProfile['tier']) {
    const oldTier = profile.tier;
    profile.tier = newTier;

    // Mint new NFT
    try {
      const nftTokenId = await icpService.mintTrustNFT(profile.userId, newTier);
      profile.nftTokenId = nftTokenId;
    } catch (error) {
      console.error('Failed to mint upgraded NFT:', error);
    }

    // Add achievement
    const achievement: Achievement = {
      id: `tier_upgrade_${newTier}`,
      title: `Tier Upgrade: ${newTier.charAt(0).toUpperCase() + newTier.slice(1)}`,
      description: `Upgraded from ${oldTier} to ${newTier} tier`,
      earnedAt: Date.now(),
      points: this.getTierPoints(newTier)
    };

    profile.achievements.push(achievement);
  }

  private async checkAchievements(profile: TrustProfile) {
    const newAchievements: Achievement[] = [];

    // First loan achievement
    if (profile.metrics.totalLoans === 1 && 
        !profile.achievements.find(a => a.id === 'first_loan')) {
      newAchievements.push({
        id: 'first_loan',
        title: 'First Steps',
        description: 'Completed your first loan',
        earnedAt: Date.now(),
        points: 10
      });
    }

    // Perfect payment record
    if (profile.metrics.onTimePaymentRate === 100 && 
        profile.metrics.totalLoans >= 5 &&
        !profile.achievements.find(a => a.id === 'perfect_record')) {
      newAchievements.push({
        id: 'perfect_record',
        title: 'Perfect Record',
        description: '100% on-time payment rate with 5+ loans',
        earnedAt: Date.now(),
        points: 25
      });
    }

    // High volume borrower
    if (profile.metrics.totalBorrowed >= 100000 &&
        !profile.achievements.find(a => a.id === 'high_volume')) {
      newAchievements.push({
        id: 'high_volume',
        title: 'High Volume Borrower',
        description: 'Borrowed over $100,000 total',
        earnedAt: Date.now(),
        points: 20
      });
    }

    profile.achievements.push(...newAchievements);
  }

  private getTierPoints(tier: TrustProfile['tier']): number {
    const points = {
      'sprout': 5,
      'sapling': 10,
      'branch': 20,
      'trunk': 35,
      'oak': 50
    };
    return points[tier];
  }

  getTierBenefits(tier: TrustProfile['tier']): string[] {
    const benefits = {
      'sprout': ['Basic loan access', 'Standard rates'],
      'sapling': ['Faster approval', '0.5% rate reduction'],
      'branch': ['Priority support', '1% rate reduction', 'Higher loan limits'],
      'trunk': ['Premium rates', 'Extended terms', 'Exclusive products'],
      'oak': ['Best rates available', 'Maximum loan amounts', 'VIP support']
    };
    return benefits[tier];
  }

  getTierProgress(profile: TrustProfile): { current: number; next: number; percentage: number } {
    const tierThresholds = {
      'sprout': { score: 40, loans: 0 },
      'sapling': { score: 60, loans: 2 },
      'branch': { score: 70, loans: 4 },
      'trunk': { score: 80, loans: 7 },
      'oak': { score: 90, loans: 10 }
    };

    const currentThreshold = tierThresholds[profile.tier];
    const tiers = Object.keys(tierThresholds) as TrustProfile['tier'][];
    const currentIndex = tiers.indexOf(profile.tier);
    
    if (currentIndex === tiers.length - 1) {
      // Already at max tier
      return { current: 100, next: 100, percentage: 100 };
    }

    const nextTier = tiers[currentIndex + 1];
    const nextThreshold = tierThresholds[nextTier];

    const scoreProgress = Math.min(100, (profile.score / nextThreshold.score) * 100);
    const loanProgress = Math.min(100, (profile.metrics.totalLoans / nextThreshold.loans) * 100);
    
    const overallProgress = Math.min(scoreProgress, loanProgress);

    return {
      current: profile.score,
      next: nextThreshold.score,
      percentage: overallProgress
    };
  }

  // Generate mock trust profile for development
  generateMockProfile(userId: string, tier: TrustProfile['tier'] = 'sapling'): TrustProfile {
    const mockMetrics: TrustMetrics = {
      totalLoans: tier === 'sprout' ? 0 : tier === 'sapling' ? 2 : tier === 'branch' ? 5 : tier === 'trunk' ? 8 : 12,
      successfulRepayments: tier === 'sprout' ? 0 : tier === 'sapling' ? 2 : tier === 'branch' ? 5 : tier === 'trunk' ? 8 : 12,
      onTimePaymentRate: tier === 'sprout' ? 100 : 98,
      totalBorrowed: tier === 'sprout' ? 0 : tier === 'sapling' ? 35000 : tier === 'branch' ? 85000 : tier === 'trunk' ? 150000 : 250000,
      totalRepaid: tier === 'sprout' ? 0 : tier === 'sapling' ? 35000 : tier === 'branch' ? 85000 : tier === 'trunk' ? 150000 : 250000,
      averageLoanSize: tier === 'sprout' ? 0 : 17500,
      daysSinceFirstLoan: tier === 'sprout' ? 0 : tier === 'sapling' ? 90 : tier === 'branch' ? 365 : tier === 'trunk' ? 730 : 1095
    };

    const profile: TrustProfile = {
      userId,
      tier,
      score: this.calculateTrustScore(mockMetrics),
      nftTokenId: `nft_${tier}_${userId}`,
      achievements: [],
      metrics: mockMetrics,
      lastUpdated: Date.now()
    };

    this.profiles.set(userId, profile);
    return profile;
  }
}

export const trustService = new TrustService();