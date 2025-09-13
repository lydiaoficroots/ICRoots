import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Globe, Gift, Shield, Zap, Globe2, CheckCircle } from 'lucide-react';

interface AuthPageProps {
  onAuth: (email: string, password: string, role: 'borrower' | 'lender') => Promise<void>;
  onInternetIdentityAuth: (role: 'borrower' | 'lender') => Promise<void>;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuth, onInternetIdentityAuth, onBack }) => {
  const [step, setStep] = useState<'role' | 'auth-method' | 'traditional' | 'ii-flow'>('role');
  const [selectedRole, setSelectedRole] = useState<'borrower' | 'lender' | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iiAuthenticating, setIIAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    country: '',
    referral: ''
  });

  const handleRoleSelection = (role: 'borrower' | 'lender') => {
    setSelectedRole(role);
    setStep('auth-method');
  };

  const handleAuthMethodSelection = (method: 'traditional' | 'internet-identity') => {
    if (method === 'traditional') {
      setStep('traditional');
    } else {
      setStep('ii-flow');
      handleInternetIdentityAuth();
    }
  };

  const handleInternetIdentityAuth = async () => {
    if (!selectedRole) return;
    
    setIIAuthenticating(true);
    setError(null);
    
    try {
      // Simulate Internet Identity authentication flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onInternetIdentityAuth(selectedRole);
    } catch (error) {
      console.error('Internet Identity authentication failed:', error);
      setError('Internet Identity authentication failed. Please try again.');
      setStep('auth-method');
    } finally {
      setIIAuthenticating(false);
    }
  };

  const handleTraditionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onAuth(formData.email, formData.password, selectedRole);
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderRoleSelection = () => (
    <div className="w-full max-w-md">
      <button
        onClick={onBack}
        className="flex items-center text-light-grey hover:text-bitcoin-gold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </button>

      <div className="bg-dark-charcoal/90 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-bitcoin-gold/20">
        <div className="text-center mb-8">
          <h1 className="text-subheading font-medium text-white mb-2 uppercase">
            Join ICRoots
          </h1>
          <p className="text-body text-light-grey/70">
            Choose your role to get started
          </p>
        </div>

        <div className="space-y-4">
          <RoleCard
            role="borrower"
            title="I want to Borrow"
            description="Get loans using Bitcoin as collateral"
            features={["Access to instant loans", "Use Bitcoin as collateral", "Build trust reputation"]}
            selected={selectedRole === 'borrower'}
            onClick={() => handleRoleSelection('borrower')}
          />
          <RoleCard
            role="lender"
            title="I want to Lend"
            description="Fund loans and earn attractive returns"
            features={["Earn competitive returns", "AI-powered matching", "Diversified portfolio"]}
            selected={selectedRole === 'lender'}
            onClick={() => handleRoleSelection('lender')}
          />
        </div>
      </div>
    </div>
  );

  const renderAuthMethodSelection = () => (
    <div className="w-full max-w-lg">
      <button
        onClick={() => setStep('role')}
        className="flex items-center text-light-grey hover:text-bitcoin-gold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Role Selection
      </button>

      <div className="bg-dark-charcoal/90 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-bitcoin-gold/20">
        <div className="text-center mb-8">
          <h1 className="text-subheading font-medium text-white mb-2 uppercase">
            Choose Authentication Method
          </h1>
          <p className="text-body text-light-grey/70">
            How would you like to authenticate?
          </p>
        </div>

        <div className="space-y-6">
          {/* Internet Identity Option */}
          <div 
            onClick={() => handleAuthMethodSelection('internet-identity')}
            className="relative cursor-pointer group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-bitcoin-gold to-mint-green rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-dark-charcoal border-2 border-bitcoin-gold/30 group-hover:border-bitcoin-gold rounded-2xl p-6 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-bitcoin-gold to-mint-green rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                    Internet Identity
                    <span className="ml-2 bg-bitcoin-gold text-primary px-2 py-1 rounded-full text-xs font-bold">RECOMMENDED</span>
                  </h3>
                  <p className="text-light-grey/70 mb-4">
                    Secure, passwordless authentication powered by ICP
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-mint-green">
                      <CheckCircle className="w-4 h-4" />
                      <span>No passwords to remember</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-mint-green">
                      <CheckCircle className="w-4 h-4" />
                      <span>Biometric authentication</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-mint-green">
                      <CheckCircle className="w-4 h-4" />
                      <span>Maximum security & privacy</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-mint-green">
                      <CheckCircle className="w-4 h-4" />
                      <span>Seamless Web3 integration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Traditional Authentication Option */}
          <div 
            onClick={() => handleAuthMethodSelection('traditional')}
            className="cursor-pointer group"
          >
            <div className="bg-dark-charcoal/50 border border-light-grey/20 group-hover:border-light-grey/40 rounded-2xl p-6 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-light-grey/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-light-grey" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Email & Password
                  </h3>
                  <p className="text-light-grey/70 mb-4">
                    Traditional authentication with email and password
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-light-grey/60">
                      <CheckCircle className="w-4 h-4" />
                      <span>Familiar login process</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-light-grey/60">
                      <CheckCircle className="w-4 h-4" />
                      <span>Works on all devices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInternetIdentityFlow = () => (
    <div className="w-full max-w-md">
      <button
        onClick={() => setStep('auth-method')}
        className="flex items-center text-light-grey hover:text-bitcoin-gold mb-8 transition-colors"
        disabled={iiAuthenticating}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Authentication Methods
      </button>

      <div className="bg-dark-charcoal/90 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-bitcoin-gold/20 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-bitcoin-gold to-mint-green rounded-full flex items-center justify-center mx-auto mb-4">
            {iiAuthenticating ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Shield className="w-10 h-10 text-primary" />
            )}
          </div>
          <h1 className="text-subheading font-medium text-white mb-2 uppercase">
            {iiAuthenticating ? 'Authenticating...' : 'Internet Identity'}
          </h1>
          <p className="text-body text-light-grey/70">
            {iiAuthenticating 
              ? 'Please complete authentication in the popup window'
              : 'Secure authentication powered by Internet Computer'
            }
          </p>
        </div>

        {iiAuthenticating ? (
          <div className="space-y-4">
            <div className="bg-bitcoin-gold/10 border border-bitcoin-gold/20 rounded-xl p-4">
              <p className="text-bitcoin-gold text-sm">
                🔐 A secure authentication window will open
              </p>
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-mint-green rounded-full animate-pulse"></div>
                <span className="text-light-grey/70 text-sm">Connecting to Internet Identity...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-light-grey/30 rounded-full"></div>
                <span className="text-light-grey/50 text-sm">Verifying your identity...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-light-grey/30 rounded-full"></div>
                <span className="text-light-grey/50 text-sm">Creating secure session...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50/10 to-indigo-50/10 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2">What is Internet Identity?</h3>
              <p className="text-light-grey/70 text-sm">
                A secure, anonymous authentication system that uses cryptographic keys instead of passwords. 
                Your identity is protected and never shared.
              </p>
            </div>
            
            <button
              onClick={handleInternetIdentityAuth}
              className="w-full bg-gradient-to-r from-bitcoin-gold to-mint-green hover:from-bitcoin-gold/90 hover:to-mint-green/90 text-primary py-4 rounded-xl font-medium uppercase transition-all duration-300 transform hover:scale-105 shadow-soft hover:shadow-glow"
            >
              Continue with Internet Identity
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-risk-red/10 border border-risk-red/20 rounded-xl p-4">
            <p className="text-risk-red text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTraditionalAuth = () => (
    <div className="w-full max-w-md">
      <button
        onClick={() => setStep('auth-method')}
        className="flex items-center text-light-grey hover:text-bitcoin-gold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Authentication Methods
      </button>

      <div className="bg-dark-charcoal/90 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-bitcoin-gold/20">
        <div className="text-center mb-8">
          <h1 className="text-subheading font-medium text-white mb-2 uppercase">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-body text-light-grey/70">
            {mode === 'signin' ? 'Sign in to your account' : 'Enter your details to get started'}
          </p>
        </div>

        {error && (
          <div className="bg-risk-red/10 border border-risk-red/20 rounded-xl p-4 mb-4">
            <p className="text-risk-red text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleTraditionalSubmit} className="space-y-4">
          {mode === 'signup' && (
            <InputField
              icon={<User size={18} />}
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          )}

          <InputField
            icon={<Mail size={18} />}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <InputField
            icon={<Lock size={18} />}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          {mode === 'signup' && (
            <>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey/50" size={18} />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-bitcoin-gold/30 bg-dark-charcoal text-white focus:ring-2 focus:ring-bitcoin-gold focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              <InputField
                icon={<Gift size={18} />}
                type="text"
                name="referral"
                placeholder="Referral Code (Optional)"
                value={formData.referral}
                onChange={handleInputChange}
              />
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-dark-charcoal/50 text-bitcoin-gold py-3 rounded-xl font-medium uppercase transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-soft hover:shadow-glow flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-bitcoin-gold border-t-transparent rounded-full animate-spin"></div>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-body text-light-grey/70">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-bitcoin-gold hover:underline ml-1 font-medium"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {mode === 'signin' && (
          <div className="text-center mt-4">
            <button className="text-caption text-light-grey/60 hover:text-bitcoin-gold transition-colors">
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {step === 'role' && renderRoleSelection()}
      {step === 'auth-method' && renderAuthMethodSelection()}
      {step === 'ii-flow' && renderInternetIdentityFlow()}
      {step === 'traditional' && renderTraditionalAuth()}
    </div>
  );
};

const RoleCard: React.FC<{
  role: 'borrower' | 'lender';
  title: string;
  description: string;
  features: string[];
  selected: boolean;
  onClick: () => void;
}> = ({ role, title, description, features, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
      selected
        ? 'border-bitcoin-gold bg-bitcoin-gold/10 dark:bg-bitcoin-gold/20'
        : 'border-light-grey dark:border-dark-charcoal hover:border-bitcoin-gold/50'
    }`}
  >
    <div className="font-medium text-white mb-2 text-lg">{title}</div>
    <div className="text-light-grey/70 mb-4">{description}</div>
    <div className="space-y-2">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm text-light-grey/60">
          <CheckCircle className="w-4 h-4 text-mint-green" />
          <span>{feature}</span>
        </div>
      ))}
    </div>
  </button>
);

const InputField: React.FC<{
  icon: React.ReactNode;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ icon, type, name, placeholder, value, onChange, required }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey/50">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pl-10 pr-4 py-3 rounded-lg border border-bitcoin-gold/30 bg-dark-charcoal text-white focus:ring-2 focus:ring-bitcoin-gold focus:border-transparent transition-all placeholder-light-grey/50"
    />
  </div>
);

export default AuthPage;