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
  Download
} from 'lucide-react';
import { useICRoots } from '../hooks/useICRoots';

interface LenderDashboardProps {
  onLogout: () => void;
}

const LenderDashboard: React.FC<LenderDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    averageROI: 12.5 // This would be calculated based on actual returns
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'fund', label: 'Fund Loans', icon: DollarSign },
    { id: 'track', label: 'Track Loans', icon: Eye },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'fund':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI-Recommended Borrowers</h2>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors">
                Refresh AI Suggestions
              </button>
            </div>
            
            <div className="grid gap-6">
              {aiRecommendations.map((borrower) => (
                <BorrowerCard 
                  key={borrower.id} 
                  borrower={borrower} 
                  onFund={fundLoan}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        );
      
      case 'track':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Active Loans</h2>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Borrower</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {loans.filter(loan => loan.lenderId === user?.id).map((loan) => (
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
                          {loan.nextPaymentDate ? new Date(loan.nextPaymentDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            On Time
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
      
      case 'earnings':
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
                <div className="text-3xl font-bold text-green-500 mb-2">${lenderMetrics.totalEarnings.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">+8.2% from last month</div>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Available to Withdraw</h3>
                <div className="text-3xl font-bold text-blue-500 mb-2">$8,420</div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition-colors">
                  Withdraw Now
                </button>
              </div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Earnings Trend</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Earnings chart would go here</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {lenderData.name}!</h1>
              <p className="opacity-90">Your lending portfolio is performing excellently</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                icon={<DollarSign className="w-8 h-8 text-green-500" />}
                title="Total Staked"
                value={`$${lenderMetrics.totalStaked.toLocaleString()}`}
                trend="+12.5%"
              />
              <MetricCard
                icon={<Users className="w-8 h-8 text-blue-500" />}
                title="Loans Funded"
                value={lenderMetrics.loansFunded.toString()}
                trend="+3 this month"
              />
              <MetricCard
                icon={<TrendingUp className="w-8 h-8 text-purple-500" />}
                title="Average ROI"
                value={`${lenderMetrics.averageROI}%`}
                trend="+0.8%"
              />
              <MetricCard
                icon={<Wallet className="w-8 h-8 text-orange-500" />}
                title="Total Earnings"
                value={`$${lenderMetrics.totalEarnings.toLocaleString()}`}
                trend="+8.2%"
              />
            </div>

            {/* AI Suggestions Preview */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">AI-Recommended Borrowers</h3>
                <button
                  onClick={() => setActiveTab('fund')}
                  className="text-blue-500 hover:text-blue-600 font-medium flex items-center transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiRecommendations.slice(0, 2).map((borrower) => (
                  <div key={borrower.id} className="border border-gray-200 dark:border-gray-600 rounded-2xl p-4">
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

const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
}> = ({ icon, title, value, trend }) => (
  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-sm text-green-500 font-medium">{trend}</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
  </div>
);

const BorrowerCard: React.FC<{ 
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
  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div>
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