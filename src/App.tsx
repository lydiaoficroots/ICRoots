import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import BorrowerDashboard from './components/BorrowerDashboard';
import LenderDashboard from './components/LenderDashboard';

type Theme = 'light' | 'dark';
type UserRole = 'borrower' | 'lender' | null;
type Page = 'landing' | 'auth' | 'dashboard';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAuth = (role: 'borrower' | 'lender') => {
    setUserRole(role);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage onAuth={handleAuth} onBack={() => setCurrentPage('landing')} />;
      case 'dashboard':
        if (userRole === 'borrower') {
          return <BorrowerDashboard onLogout={handleLogout} />;
        } else if (userRole === 'lender') {
          return <LenderDashboard onLogout={handleLogout} />;
        }
        return null;
      default:
        return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-primary via-dark-charcoal to-primary' 
        : 'bg-gradient-to-br from-light-grey via-white to-mint-green/20'
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-3 rounded-xl transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-dark-charcoal text-bitcoin-gold hover:bg-primary'
            : 'bg-white text-dark-charcoal hover:bg-light-grey'
        } shadow-soft hover:shadow-glow`}
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {renderPage()}
    </div>
  );
}

export default App;