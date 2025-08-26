import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Wallet, 
  LogOut,
  Menu,
  X,
  Bitcoin,
  Eye,
  Star,
  ArrowRight,
  Download,
  Brain,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { useICRoots } from '../hooks/useICRoots';

interface LenderDashboardProps {
  onLogout: () => void;
}

const LenderDashboard: React.FC<LenderDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const { 
    user, 
    loans, 
    loading,
    getAIRecommendations,
    fundLoan
  } = useICRoots();
  const [aiRecommendations, setAIRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const loadRecommendations = async () => {
      const recommendations = await getAIRecommendations();
      setAIRecommendations(recommendations);
    };
    
    if (user?.role === 'lender') {
      loadRecommendations();
    }
  }, [user, getAIRecommendations]);

  // Calculate lender metrics
  const lenderMetrics = {
    totalStaked: loans.reduce((sum, loan) => sum + (loan.lenderId === user?.id ? loan.amount : 0), 0),
    loansFunded: loans.filter(loan => loan.lenderId === user?.id).length,
    activeLoans: loans.filter(loan => loan.lenderId === user?.id && loan.status === 'active').length,
    totalEarnings: loans.reduce((sum, loan) => {
      if (loan.lenderId === user?.id && loan.status === 'repaid') {
        return sum + (loan.totalPaid - loan.amount);
      }
      return sum;
    }, 0),
    averageROI: 12.5,
    pendingReturns: 8420,
    monthlyEarnings: [
      { month: 'Jan', amount: 2400 },
      { month: 'Feb', amount: 3200 },
      { month: 'Mar', amount: 2800 },
      { month: 'Apr', amount: 3600 },
      { month: 'May', amount: 4200 },
      { month: 'Jun', amount: 3800 }
    ]
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'browse', label: 'Browse Loans', icon: Search },
    { id: 'ai-match', label: 'AI Matching', icon: Brain },
    { id: 'portfolio', label: 'My Portfolio', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'browse':
        return <BrowseLoansTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} riskFilter={riskFilter} setRiskFilter={setRiskFilter} onFund={fundLoan} loading={loading} />;
      
      case 'ai-match':
        return <AIMatchingTab recommendations={aiRecommendations} onFund={fundLoan} loading={loading} />;
      
      case 'portfolio':
        return <PortfolioTab loans={loans.filter(loan => loan.lenderId === user?.id)} />;
      
      case 'analytics':
        return <AnalyticsTab metrics={lenderMetrics} />;
      
      case 'earnings':
        return <EarningsTab metrics={lenderMetrics} />;
      
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="opacity-90">Your lending portfolio is performing excellently</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-80">Total Portfolio Value</p>
                  <p className="text-2xl font-bold">${lenderMetrics.totalStaked.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Monthly Returns</p>
                  <p className="text-2xl font-bold">${lenderMetrics.monthlyEarnings[lenderMetrics.monthlyEarnings.length - 1]?.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                icon={<DollarSign className="w-8 h-8 text-green-500" />}
                title="Total Staked"
                value={`$${lenderMetrics.totalStaked.toLocaleString()}`}
                trend="+12.5%"
                subtitle="vs last month"
              />
              <MetricCard
                icon={<Users className="w-8 h-8 text-blue-500" />}
                title="Loans Funded"
                value={lenderMetrics.loansFunded.toString()}
                trend="+3 this month"
                subtitle="Active borrowers"
              />
              <MetricCard
                icon={<TrendingUp className="w-8 h-8 text-purple-500" />}
                title="Average ROI"
                value={`${lenderMetrics.averageROI}%`}
                trend="+0.8%"
                subtitle="Annual return"
              />
              <MetricCard
                icon={<Wallet className="w-8 h-8 text-orange-500" />}
                title="Total Earnings"
                value={`$${lenderMetrics.totalEarnings.toLocaleString()}`}
                trend="+8.2%"
                subtitle="All time"
              />
            </div>

            {/* AI Suggestions Preview */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-blue-500" />
                  AI-Recommended Borrowers
                </h3>
                <button
                  onClick={() => setActiveTab('ai-match')}
                  className="text-blue-500 hover:text-blue-600 font-medium flex items-center transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiRecommendations.slice(0, 2).map((borrower) => (
                  <BorrowerPreviewCard key={borrower.id} borrower={borrower} />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {loans.filter(loan => loan.lenderId === user?.id).slice(0, 3).map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {loan.borrowerId.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          ${loan.amount.toLocaleString()} loan funded
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Borrower {loan.borrowerId.slice(-4)} • {loan.interestRate}% APR
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      loan.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <img 
              src="/ICRoots logo, no background.png" 
              alt="ICRoots Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-800 dark:text-white">ICRoots</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <nav className="mt-6 px-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-2xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Browse Loans Tab Component
const BrowseLoansTab: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  riskFilter: string;
  setRiskFilter: (filter: string) => void;
  onFund: (loanId: string, amount: number) => Promise<boolean>;
  loading: boolean;
}> = ({ searchTerm, setSearchTerm, riskFilter, setRiskFilter, onFund, loading }) => {
  const mockLoans = [
    {
      id: 'BL001',
      borrowerId: 'borrower1',
      borrowerName: 'Michael K.',
      amount: 25000,
      purpose: 'Business expansion',
      interestRate: 8.5,
      term: 12,
      collateralRatio: '150%',
      trustTier: 'branch',
      aiScore: 92,
      riskLevel: 'low' as const,
      timePosted: '2 hours ago'
    },
    {
      id: 'BL002',
      borrowerId: 'borrower2',
      borrowerName: 'Jennifer L.',
      amount: 18000,
      purpose: 'Equipment purchase',
      interestRate: 7.8,
      term: 18,
      collateralRatio: '160%',
      trustTier: 'sapling',
      aiScore: 88,
      riskLevel: 'low' as const,
      timePosted: '5 hours ago'
    },
    {
      id: 'BL003',
      borrowerId: 'borrower3',
      borrowerName: 'David R.',
      amount: 32000,
      purpose: 'Debt consolidation',
      interestRate: 9.2,
      term: 24,
      collateralRatio: '140%',
      trustTier: 'trunk',
      aiScore: 85,
      riskLevel: 'medium' as const,
      timePosted: '1 day ago'
    }
  ];

  const filteredLoans = mockLoans.filter(loan => {
    const matchesSearch = loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || loan.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Browse Loan Requests</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search borrowers or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredLoans.map((loan) => (
          <LoanRequestCard key={loan.id} loan={loan} onFund={onFund} loading={loading} />
        ))}
      </div>
    </div>
  );
};

// AI Matching Tab Component
const AIMatchingTab: React.FC<{
  recommendations: any[];
  onFund: (loanId: string, amount: number) => Promise<boolean>;
  loading: boolean;
}> = ({ recommendations, onFund, loading }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-500" />
            AI-Powered Matching
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Personalized borrower recommendations based on your lending preferences
          </p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh AI Suggestions
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">How AI Matching Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Risk Analysis</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">AI evaluates borrower creditworthiness and default probability</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Preference Matching</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Matches borrowers to your risk tolerance and return goals</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Smart Recommendations</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Provides ranked suggestions with confidence scores</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations.map((borrower) => (
          <AIRecommendationCard key={borrower.id} borrower={borrower} onFund={onFund} loading={loading} />
        ))}
      </div>
    </div>
  );
};

// Portfolio Tab Component
const PortfolioTab: React.FC<{ loans: any[] }> = ({ loans }) => {
  const portfolioStats = {
    totalInvested: loans.reduce((sum, loan) => sum + loan.amount, 0),
    activeLoans: loans.filter(loan => loan.status === 'active').length,
    completedLoans: loans.filter(loan => loan.status === 'repaid').length,
    totalReturns: loans.reduce((sum, loan) => sum + (loan.totalPaid - loan.amount), 0)
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Portfolio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Invested</h3>
          <p className="text-3xl font-bold text-blue-500">${portfolioStats.totalInvested.toLocaleString()}</p>
        </div>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Active Loans</h3>
          <p className="text-3xl font-bold text-green-500">{portfolioStats.activeLoans}</p>
        </div>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Completed</h3>
          <p className="text-3xl font-bold text-purple-500">{portfolioStats.completedLoans}</p>
        </div>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Returns</h3>
          <p className="text-3xl font-bold text-orange-500">${portfolioStats.totalReturns.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Borrower</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Returns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {loan.borrowerId.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Borrower {loan.borrowerId.slice(-4)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Trust: Sapling</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${loan.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${((loan.term - loan.remainingPayments) / loan.term) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                      {Math.round(((loan.term - loan.remainingPayments) / loan.term) * 100)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${(loan.totalPaid - loan.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      loan.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : loan.status === 'repaid'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics & Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Earnings Trend</h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Earnings chart visualization</p>
              <div className="mt-4 space-y-2">
                {metrics.monthlyEarnings.map((month: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{month.month}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">${month.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Risk Distribution</h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Risk distribution chart</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Low Risk</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600">Medium Risk</span>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">High Risk</span>
                  <span className="font-semibold">5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">98.5%</div>
            <p className="text-gray-600 dark:text-gray-300">On-time Payment Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">4.2</div>
            <p className="text-gray-600 dark:text-gray-300">Average Loan Duration (months)</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">0.8%</div>
            <p className="text-gray-600 dark:text-gray-300">Default Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Earnings Tab Component
const EarningsTab: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Earnings Overview</h2>
        <button className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Total Earnings</h3>
          <div className="text-4xl font-bold text-green-500 mb-2">${metrics.totalEarnings.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">+8.2% from last month</div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Interest Earned</span>
              <span className="font-semibold">${(metrics.totalEarnings * 0.85).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Fees & Bonuses</span>
              <span className="font-semibold">${(metrics.totalEarnings * 0.15).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Available to Withdraw</h3>
          <div className="text-4xl font-bold text-blue-500 mb-2">${metrics.pendingReturns.toLocaleString()}</div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm transition-colors">
            Withdraw Now
          </button>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Pending Interest</span>
              <span className="font-semibold">${(metrics.pendingReturns * 0.7).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Principal Returns</span>
              <span className="font-semibold">${(metrics.pendingReturns * 0.3).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Earnings History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loan ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Jan {15 + i}, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Interest Payment
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    +${(250 + i * 50).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    LN00{i}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Supporting Components
const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  subtitle: string;
}> = ({ icon, title, value, trend, subtitle }) => (
  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-sm text-green-500 font-medium">{trend}</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>
    <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
  </div>
);

const BorrowerPreviewCard: React.FC<{ borrower: any }> = ({ borrower }) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-2xl p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="font-semibold text-gray-800 dark:text-white">Borrower {borrower.borrowerId?.slice(-4) || 'Unknown'}</span>
      <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
        {borrower.riskLevel || 'low'} risk
      </span>
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
      <div>Amount: ${borrower.amount?.toLocaleString() || 'N/A'}</div>
      <div>AI Score: {borrower.aiScore || 'N/A'}/100</div>
      <div>Interest: {borrower.interestRate?.toFixed(1) || 'N/A'}%</div>
    </div>
  </div>
);

const LoanRequestCard: React.FC<{ 
  loan: any; 
  onFund: (loanId: string, amount: number) => Promise<boolean>;
  loading: boolean;
}> = ({ loan, onFund, loading }) => {
  const [funding, setFunding] = useState(false);

  const handleFund = async (amount: number) => {
    setFunding(true);
    try {
      await onFund(loan.id, amount);
    } finally {
      setFunding(false);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {loan.borrowerName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{loan.borrowerName}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {loan.trustTier}
              </span>
              <span>AI Score: <strong>{loan.aiScore}/100</strong></span>
              <span className="text-gray-500">{loan.timePosted}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          loan.riskLevel === 'low' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : loan.riskLevel === 'medium'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {loan.riskLevel} risk
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Requested Amount</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">${loan.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Interest Rate</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{loan.interestRate}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Term</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{loan.term} months</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Collateral</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{loan.collateralRatio}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Purpose</p>
        <p className="text-gray-800 dark:text-white">{loan.purpose}</p>
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={() => handleFund(loan.amount)}
          disabled={funding || loading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-full transition-colors flex items-center justify-center font-medium"
        >
          {funding ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Fund Full Amount'
          )}
        </button>
        <button 
          onClick={() => handleFund(loan.amount * 0.5)}
          disabled={funding || loading}
          className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 py-3 px-4 rounded-full transition-colors font-medium"
        >
          Fund Partial
        </button>
        <button className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-full transition-colors">
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const AIRecommendationCard: React.FC<{ 
  borrower: any; 
  onFund: (loanId: string, amount: number) => Promise<boolean>;
  loading: boolean;
}> = ({ borrower, onFund, loading }) => {
  const [funding, setFunding] = useState(false);

  const handleFund = async (amount: number) => {
    setFunding(true);
    try {
      await onFund(borrower.id, amount);
    } finally {
      setFunding(false);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AI Recommended</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
              95% Match
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
            Borrower {borrower.borrowerId?.slice(-4) || 'Unknown'}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <span>AI Score: <strong>{borrower.aiScore || 'N/A'}/100</strong></span>
            <span className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              sapling
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          (borrower.riskLevel || 'low') === 'low' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : (borrower.riskLevel || 'low') === 'medium'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {borrower.riskLevel || 'low'} risk
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Requested Amount</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            ${borrower.amount?.toLocaleString() || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Interest Rate</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{borrower.interestRate?.toFixed(1) || 'N/A'}%</p>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-4">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Why AI Recommends This Borrower:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• Excellent repayment history (98% on-time rate)</li>
          <li>• Strong collateral ratio (160%)</li>
          <li>• Matches your risk tolerance preferences</li>
          <li>• High probability of successful completion</li>
        </ul>
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={() => handleFund(borrower.amount)}
          disabled={funding || loading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-full transition-colors flex items-center justify-center"
        >
          {funding ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Fund Full Amount'
          )}
        </button>
        <button 
          onClick={() => handleFund(borrower.amount * 0.5)}
          disabled={funding || loading}
          className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 py-2 px-4 rounded-full transition-colors"
        >
          Fund Partial
        </button>
      </div>
    </div>
  );
};

export default LenderDashboard;