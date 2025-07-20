import React, { useState } from 'react';
import { Bitcoin, Copy, QrCode, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';

interface BTCWalletProps {
  balance: number;
  usdValue: number;
}

const BTCWallet: React.FC<BTCWalletProps> = ({ balance, usdValue }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Mock wallet address
  const walletAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    // Mock refresh functionality
    console.log("Refreshing wallet balance...");
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bitcoin className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">BTC Wallet</h2>
              <p className="opacity-90">ICP-Generated Address</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-lg opacity-90 mb-1">Bitcoin Balance</p>
            <p className="text-4xl font-bold">{balance} BTC</p>
          </div>
          <div>
            <p className="text-lg opacity-90 mb-1">USD Value</p>
            <p className="text-4xl font-bold">${usdValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Warning for Empty Wallet */}
      {balance === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-3xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Empty Wallet
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                Your BTC wallet is empty. You need to deposit Bitcoin to use as collateral for loans.
              </p>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-full transition-colors">
                Learn How to Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Address */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Wallet Address</h3>
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>{showQR ? 'Hide' : 'Show'} QR</span>
          </button>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
              {walletAddress}
            </code>
            <button
              onClick={handleCopyAddress}
              className="ml-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        {copied && (
          <div className="text-green-600 dark:text-green-400 text-sm mb-4">
            ✓ Address copied to clipboard
          </div>
        )}
        
        {showQR && (
          <div className="text-center mb-4">
            <div className="inline-block bg-white p-4 rounded-2xl shadow-lg">
              <div className="w-48 h-48 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">QR Code</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p className="mb-2">
            This is your automatically generated ICP wallet address for Bitcoin deposits.
            Send Bitcoin to this address to use as collateral for loans.
          </p>
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <ExternalLink className="w-4 h-4" />
            <a href="#" className="hover:underline">View on blockchain explorer</a>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
        
        {balance > 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Bitcoin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">Received</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Jan {15 + i}, 2025 at 3:42 PM
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    +0.{15 + i * 5} BTC
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ${(8000 + i * 2000).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bitcoin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Your transaction history will appear here once you make deposits
            </p>
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Security Information
        </h3>
        <div className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
          <p>• This wallet is automatically generated and secured by the Internet Computer Protocol</p>
          <p>• Your private keys are managed securely by ICP smart contracts</p>
          <p>• Bitcoin deposits are locked as collateral and can be released upon loan repayment</p>
          <p>• All transactions are recorded on-chain for full transparency</p>
        </div>
      </div>
    </div>
  );
};

export default BTCWallet;