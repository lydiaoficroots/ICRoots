import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import BorrowerDashboard from './components/BorrowerDashboard';
import LenderDashboard from './components/LenderDashboard';
import { useICRoots } from './hooks/useICRoots';

type Page = 'landing' | 'auth' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { user, login, logout, loading, error } = useICRoots();

  useEffect(() => {
    // Always use dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const handleAuth = async (email: string, password: string, role: 'borrower' | 'lender') => {
    const success = await login(email, password, role);
    if (success) {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return (
          <AuthPage 
            onAuth={handleAuth} 
            onBack={() => setCurrentPage('landing')}
          />
        );
      case 'dashboard':
        if (user?.role === 'borrower') {
          return <BorrowerDashboard onLogout={handleLogout} />;
        } else if (user?.role === 'lender') {
          return <LenderDashboard onLogout={handleLogout} />;
        }
        return null;
      default:
        return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-dark-charcoal to-primary">
      {renderPage()}
    </div>
  );
}

export default App;