import React, { useState } from 'react';
import { 
  Bitcoin, 
  Wallet, 
  FileText, 
  History, 
  Award, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import TrustNFTDisplay from './TrustNFTDisplay';
import BTCWallet from './BTCWallet';
import LoanApplication from './LoanApplication';
import LoanHistory from './LoanHistory';
import { useICRoots } from '../hooks/useICRoots';

interface BorrowerDashboardProps {
  onLogout: () => void;
}

const BorrowerDashboard: React.FC<BorrowerDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    user, 
    wallet, 
    trustProfile, 
    loans, 
    loading,
    refreshWallet,
    submitLoanApplication,
    refreshTrustProfile
  } = useICRoots();

  const activeLoan = loans.find(loan => loan.status === 'active');
  const aiScore = trustProfile?.score || 85;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'wallet', label: 'BTC Wallet', icon: Wallet },
    { id: 'apply', label: 'Apply for Loan', icon: FileText },
    { id: 'history', label: 'Loan History', icon: History },
    { id: 'trust', label: 'Trust NFT', icon: Award },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'wallet':
        return (
          <BTCWallet 
            balance={wallet?.balance || 0} 
            usdValue={wallet?.usdValue || 0}
            address={wallet?.address || ''}
            onRefresh={refreshWallet}
          />
        );
      case 'apply':
        return (
          <LoanApplication 
            aiScore={aiScore}
            onSubmit={submitLoanApplication}
            loading={loading}
          />
        );
      case 'history':
        return <LoanHistory loans={loans} />;
      case 'trust':
        return (
          <TrustNFTDisplay 
            tier={trustProfile?.tier || 'sprout'}
            profile={trustProfile}
            onRefresh={refreshTrustProfile}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-primary to-bitcoin-gold rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-subheading font-medium mb-2 uppercase">Welcome back, {user?.name}!</h1>
                  <p className="opacity-90">Ready to unlock your Bitcoin's potential?</p>
                </div>
                <TrustNFTDisplay tier={trustProfile?.tier || 'sprout'} compact />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                icon={<Bitcoin className="w-8 h-8 text-bitcoin-gold" />}
                title="BTC Balance"
                value={`${wallet?.balance.toFixed(4) || '0.0000'} BTC`}
                subtitle={`$${wallet?.usdValue.toLocaleString() || '0'}`}
                trend="+2.5%"
              />
              <MetricCard
                icon={<TrendingUp className="w-8 h-8 text-mint-green" />}
                title="AI Credit Score"
                value={aiScore.toString()}
                subtitle="Excellent standing"
                trend="+5 pts"
              />
              <MetricCard
                icon={<CheckCircle className="w-8 h-8 text-trust-blue" />}
                title="Trust Tier"
                value={(trustProfile?.tier || 'sprout').charAt(0).toUpperCase() + (trustProfile?.tier || 'sprout').slice(1)}
                subtitle="Growing steadily"
                trend="Level up soon"
              />
            </div>

            {/* Active Loan */}
            {activeLoan && (
              <div className="bg-white/70 dark:bg-dark-charcoal/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
                <h3 className="text-lg font-medium mb-4 text-dark-charcoal dark:text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-trust-blue" />
                  Active Loan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-caption text-dark-charcoal/70 dark:text-light-grey/70">Loan Amount</p>
                    <p className="text-xl font-bold text-dark-charcoal dark:text-white">
                      ${activeLoan.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-dark-charcoal/70 dark:text-light-grey/70">Next Payment</p>
                    <p className="text-body font-medium text-dark-charcoal dark:text-white">
                      {activeLoan.nextPaymentDate ? new Date(activeLoan.nextPaymentDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-dark-charcoal/70 dark:text-light-grey/70">Remaining</p>
                    <p className="text-body font-medium text-dark-charcoal dark:text-white">
                      {activeLoan.remainingPayments} payments
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-light-grey dark:bg-dark-charcoal rounded-full h-2">
                    <div 
                      className="bg-mint-green h-2 rounded-full" 
                      style={{ width: `${((activeLoan.term - activeLoan.remainingPayments) / activeLoan.term) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-caption text-dark-charcoal/70 dark:text-light-grey/70 mt-1">
                    {Math.round(((activeLoan.term - activeLoan.remainingPayments) / activeLoan.term) * 100)}% repaid
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/70 dark:bg-dark-charcoal/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-medium mb-4 text-dark-charcoal dark:text-white">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('apply')}
                  className="flex items-center p-4 bg-primary text-bitcoin-gold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-soft hover:shadow-glow"
                >
                  <FileText className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <p className="font-medium uppercase">Apply for New Loan</p>
                    <p className="text-caption opacity-90">Get instant pre-approval</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="flex items-center p-4 bg-bitcoin-gold text-primary rounded-xl hover:bg-bitcoin-gold/90 transition-all duration-300 shadow-soft hover:shadow-glow"
                >
                  <Wallet className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <p className="font-medium uppercase">Manage BTC Wallet</p>
                    <p className="text-caption opacity-90">View balance & deposit</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-dark-charcoal/80 backdrop-blur-sm shadow-soft transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-6 border-b border-light-grey dark:border-dark-charcoal">
          <div className="flex items-center space-x-2">
            <img 
              src="/ICRoots logo, no background.png" 
              alt="ICRoots Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-dark-charcoal dark:text-white">ICRoots</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6 text-dark-charcoal dark:text-light-grey" />
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
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-primary text-bitcoin-gold shadow-glow'
                  : 'text-dark-charcoal dark:text-light-grey hover:bg-light-grey dark:hover:bg-dark-charcoal'
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
            className="w-full flex items-center px-4 py-3 text-risk-red hover:bg-risk-red/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-6 bg-white/80 dark:bg-dark-charcoal/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-light-grey dark:hover:bg-dark-charcoal transition-colors"
          >
            <Menu className="w-6 h-6 text-dark-charcoal dark:text-light-grey" />
          </button>
          <h1 className="text-lg font-medium text-dark-charcoal dark:text-white uppercase">
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
  subtitle: string;
  trend: string;
}> = ({ icon, title, value, subtitle, trend }) => (
  <div className="bg-white/70 dark:bg-dark-charcoal/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-caption text-mint-green font-medium">{trend}</span>
    </div>
    <h3 className="text-body font-medium text-dark-charcoal dark:text-white mb-1">{title}</h3>
    <p className="text-xl font-bold text-dark-charcoal dark:text-white mb-1">{value}</p>
    <p className="text-caption text-dark-charcoal/70 dark:text-light-grey/70">{subtitle}</p>
  </div>
);

export default BorrowerDashboard;