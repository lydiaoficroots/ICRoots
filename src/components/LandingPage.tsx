import React from 'react';
import { Bitcoin, Shield, Zap, TrendingUp, Star, ArrowRight, Globe, Lock } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <img 
            src="/ICRoots logo, no background.png" 
            alt="ICRoots Logo" 
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold text-bitcoin-gold drop-shadow-lg">
            ICRoots
          </span>
        </div>
        <div className="hidden md:flex space-x-8 text-light-grey">
          <a href="#how-it-works" className="hover:text-bitcoin-gold transition-colors">
            How It Works
          </a>
          <a href="#why-icp" className="hover:text-bitcoin-gold transition-colors">
            Why ICP
          </a>
          <a href="#testimonials" className="hover:text-bitcoin-gold transition-colors">
            Reviews
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 max-w-6xl mx-auto">
        <h1 className="text-headline md:text-7xl font-bold mb-6 leading-tight uppercase">
          <span className="bg-gradient-to-r from-primary via-bitcoin-gold to-mint-green bg-clip-text text-transparent">
            Where Bitcoin
          </span>
          <br />
          <span className="text-white">Backs You</span>
        </h1>
        <p className="text-body md:text-xl text-light-grey/80 mb-8 max-w-3xl mx-auto">
          Powered by AI, Secured on ICP. The future of Bitcoin-backed lending is here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-primary hover:bg-primary/90 text-bitcoin-gold px-8 py-4 rounded-xl text-body font-medium uppercase transition-all duration-300 shadow-soft hover:shadow-glow transform hover:-translate-y-1"
          >
            Get Started <ArrowRight className="inline ml-2" size={24} />
          </button>
          <button className="border-2 border-bitcoin-gold text-bitcoin-gold px-8 py-4 rounded-xl text-body font-medium uppercase hover:bg-bitcoin-gold hover:text-primary transition-all duration-300">
            Explore Platform
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-subheading font-medium text-center mb-16 text-white uppercase">
          How ICRoots Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Bitcoin className="w-12 h-12 text-bitcoin-gold" />}
            title="Deposit Bitcoin"
            description="Securely deposit Bitcoin as collateral into your auto-generated ICP wallet"
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-trust-blue" />}
            title="AI Assessment"
            description="Our AI evaluates your profile and provides instant loan pre-approval"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-mint-green" />}
            title="Get Funded"
            description="Receive loans in fiat or USDT from our network of verified lenders"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-primary" />}
            title="Build Trust"
            description="Earn soulbound NFTs that grow your trust tier and unlock better rates"
          />
        </div>
      </section>

      {/* Why ICP & Bitcoin */}
      <section id="why-icp" className="py-20 px-6 bg-dark-charcoal/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-subheading font-medium text-center mb-16 text-white uppercase">
            Why ICP & Bitcoin?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Lock className="w-10 h-10 text-trust-blue" />}
              title="Secure"
              description="End-to-end encryption and decentralized architecture ensure your assets are always protected"
            />
            <BenefitCard
              icon={<Globe className="w-10 h-10 text-mint-green" />}
              title="Transparent"
              description="All transactions are recorded on-chain with full auditability and transparency"
            />
            <BenefitCard
              icon={<Zap className="w-10 h-10 text-bitcoin-gold" />}
              title="Borderless"
              description="Access global lending markets without geographic restrictions or traditional banking limits"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-subheading font-medium text-center mb-16 text-white uppercase">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard
            quote="ICRoots made it incredibly easy to unlock the value of my Bitcoin without selling. The AI assessment was fair and fast."
            author="Sarah Chen"
            role="Borrower"
            rating={5}
          />
          <TestimonialCard
            quote="As a lender, I love the AI-powered borrower matching. It's helped me make informed decisions and earn consistent returns."
            author="Marcus Rivera"
            role="Lender"
            rating={5}
          />
          <TestimonialCard
            quote="The trust NFT system is genius. My rates improved as I built my reputation. It's lending gamified in the best way."
            author="Alex Petrov"
            role="Borrower"
            rating={5}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-light-grey py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/ICRoots logo, no background.png" 
                alt="ICRoots Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">ICRoots</span>
            </div>
            <p className="text-light-grey/70">Where Bitcoin Backs You</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-light-grey/70">
              <li><a href="#" className="hover:text-white transition-colors">For Borrowers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Lenders</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Features</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-light-grey/70">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-light-grey/70">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-light-grey/20 mt-8 pt-8 text-center text-light-grey/70">
          <p className="text-caption">&copy; 2025 ICRoots. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-6 rounded-2xl bg-dark-charcoal/70 backdrop-blur-sm shadow-soft hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
    <p className="text-body text-light-grey/70">{description}</p>
  </div>
);

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-8 rounded-2xl bg-dark-charcoal/70 backdrop-blur-sm shadow-soft">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-lg font-medium mb-4 text-white">{title}</h3>
    <p className="text-body text-light-grey/70">{description}</p>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; author: string; role: string; rating: number }> = ({ quote, author, role, rating }) => (
  <div className="p-6 rounded-2xl bg-dark-charcoal/70 backdrop-blur-sm shadow-soft">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-bitcoin-gold fill-current" />
      ))}
    </div>
    <p className="text-light-grey/80 mb-4 italic text-body">"{quote}"</p>
    <div>
      <p className="font-medium text-white">{author}</p>
      <p className="text-caption text-light-grey/60">{role}</p>
    </div>
  </div>
);

export default LandingPage;