import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import BorrowerDashboard from './components/BorrowerDashboard';
import LenderDashboard from './components/LenderDashboard';
import { useICRoots } from './hooks/useICRoots';
import { icpService } from './services/icpService';

type Page = 'landing' | 'auth' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { user, login, logout, loading, error } = useICRoots();

  useEffect(() => {
    // Always use dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const handleAuth = async (email: string, password: string, role: 'borrower' | 'lender') => {
    await login(email, password, role);
    setCurrentPage('dashboard');
  };

  const handleInternetIdentityAuth = async (role: 'borrower' | 'lender') => {
    try {
      // Authenticate with Internet Identity
      const success = await icpService.login();
      if (success) {
        // Create a mock user for Internet Identity authentication
        const iiUser = {
          id: `ii_user_${Date.now()}`,
          email: 'user@internetidentity.ic',
          name: 'Internet Identity User',
          role,
          isAuthenticated: true
        };
        
        // Use the existing login flow but with II user data
        await login(iiUser.email, 'ii_auth', role);
        setCurrentPage('dashboard');
      } else {
        throw new Error('Internet Identity authentication failed');
      }
    } catch (error) {
      console.error('Internet Identity authentication failed:', error);
      throw error;
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
            onInternetIdentityAuth={handleInternetIdentityAuth}
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