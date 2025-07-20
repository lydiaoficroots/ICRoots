import React from 'react';

interface TrustNFTDisplayProps {
  tier: string;
  compact?: boolean;
}

const TrustNFTDisplay: React.FC<TrustNFTDisplayProps> = ({ tier, compact = false }) => {
  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'sprout':
        return {
          emoji: '🌱',
          name: 'Sprout',
          description: 'New user - Just getting started',
          level: 1,
          progress: 20,
          benefits: ['Basic loan access', 'Standard rates']
        };
      case 'sapling':
        return {
          emoji: '🌿',
          name: 'Sapling',
          description: '1-2 successful loans completed',
          level: 2,
          progress: 40,
          benefits: ['Faster approval', '0.5% rate reduction']
        };
      case 'branch':
        return {
          emoji: '🌲',
          name: 'Branch',
          description: 'Good repayment history',
          level: 3,
          progress: 60,
          benefits: ['Priority support', '1% rate reduction', 'Higher loan limits']
        };
      case 'trunk':
        return {
          emoji: '🌳',
          name: 'Trunk',
          description: 'Consistent good behavior',
          level: 4,
          progress: 80,
          benefits: ['Premium rates', 'Extended terms', 'Exclusive products']
        };
      case 'oak':
        return {
          emoji: '🌰',
          name: 'Oak',
          description: 'Highest trust level',
          level: 5,
          progress: 100,
          benefits: ['Best rates available', 'Maximum loan amounts', 'VIP support']
        };
      default:
        return getTierInfo('sprout');
    }
  };

  const tierInfo = getTierInfo(tier);

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
          {tierInfo.emoji}
        </div>
        <div>
          <p className="font-semibold text-white">{tierInfo.name}</p>
          <p className="text-xs text-white/80">Level {tierInfo.level}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
        <div className="text-6xl mb-4">{tierInfo.emoji}</div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{tierInfo.name}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{tierInfo.description}</p>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <span className="text-sm text-gray-600 dark:text-gray-300">Trust Level</span>
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {tierInfo.level}/5
          </span>
        </div>
        
        {/* Progress to Next Level */}
        {tierInfo.level < 5 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Progress to next level</span>
              <span>{tierInfo.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${tierInfo.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Benefits</h3>
        <div className="space-y-3">
          {tierInfo.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NFT Details */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">NFT Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Type:</span>
            <span className="text-gray-800 dark:text-white font-semibold">Soulbound NFT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Blockchain:</span>
            <span className="text-gray-800 dark:text-white font-semibold">Internet Computer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Transferable:</span>
            <span className="text-red-500 font-semibold">No (Soulbound)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Upgradeable:</span>
            <span className="text-green-500 font-semibold">Yes (Automatic)</span>
          </div>
        </div>
      </div>

      {/* How to Level Up */}
      {tierInfo.level < 5 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Level Up Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
              <span className="text-gray-700 dark:text-gray-300">Make timely loan repayments</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
              <span className="text-gray-700 dark:text-gray-300">Complete multiple successful loans</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
              <span className="text-gray-700 dark:text-gray-300">Maintain good communication with lenders</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustNFTDisplay;