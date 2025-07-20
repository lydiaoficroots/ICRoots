import React, { useState } from 'react';
import { FileText, Upload, AlertCircle, CheckCircle, X, Brain, DollarSign, Clock } from 'lucide-react';

interface LoanApplicationProps {
  aiScore: number;
}

const LoanApplication: React.FC<LoanApplicationProps> = ({ aiScore }) => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    purpose: '',
    idFile: null as File | null
  });
  const [showAIResult, setShowAIResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, idFile: file });
    }
  };

  const calculateCollateral = () => {
    const amount = parseFloat(formData.amount) || 0;
    const btcPrice = 41667; // Mock BTC price
    const collateralRatio = 1.5; // 150% collateralization
    return (amount * collateralRatio) / btcPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsSubmitting(false);
      setShowAIResult(true);
    }, 3000);
  };

  const aiResult = {
    approved: aiScore >= 80,
    score: aiScore,
    reasons: aiScore >= 80 
      ? ["Strong credit history", "Sufficient collateral", "Low risk profile"]
      : ["Credit score needs improvement", "Higher risk assessment", "Additional verification required"]
  };

  if (showAIResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-3xl p-8 text-center shadow-lg ${
          aiResult.approved 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}>
          <div className="flex justify-center mb-6">
            {aiResult.approved ? (
              <CheckCircle className="w-20 h-20" />
            ) : (
              <X className="w-20 h-20" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            {aiResult.approved ? 'Pre-Approved!' : 'Not Approved'}
          </h2>
          
          <p className="text-xl mb-6 opacity-90">
            {aiResult.approved 
              ? 'Your loan application has been pre-approved by our AI system'
              : 'Your application needs some improvements before approval'
            }
          </p>
          
          <div className="bg-white/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="w-6 h-6" />
              <span className="text-lg font-semibold">AI Credit Score</span>
            </div>
            <div className="text-4xl font-bold">{aiResult.score}/100</div>
          </div>
        </div>

        <div className="mt-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {aiResult.approved ? 'Approval Factors' : 'Areas for Improvement'}
          </h3>
          <div className="space-y-3">
            {aiResult.reasons.map((reason, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${aiResult.approved ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700 dark:text-gray-300">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {aiResult.approved && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">Next Steps</h3>
            <div className="space-y-3 text-blue-700 dark:text-blue-300">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span>Your application will be reviewed by our lenders</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span>You'll receive funding offers within 24 hours</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <span>Choose your preferred lender and receive funds</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAIResult(false)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-colors"
          >
            Submit New Application
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">AI Processing Your Application</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our AI is analyzing your profile and determining your creditworthiness...
          </p>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Identity verification complete</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Credit assessment in progress</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">Risk evaluation pending</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Apply for Loan</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Amount
            </label>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
            {formData.amount && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Required BTC collateral: ~{calculateCollateral().toFixed(4)} BTC
              </p>
            )}
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Purpose of Loan
            </label>
            <textarea
              name="purpose"
              placeholder="Please describe what you'll use this loan for..."
              value={formData.purpose}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* ID Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Valid ID
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                id="id-upload"
                required
              />
              <label htmlFor="id-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {formData.idFile ? formData.idFile.name : "Click to upload your ID"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  National ID, Driver's License, or Passport (JPG, PNG, PDF)
                </p>
              </label>
            </div>
          </div>

          {/* AI Score Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">AI Pre-Assessment</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Current AI Score</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{aiScore}/100</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                aiScore >= 80 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : aiScore >= 60
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {aiScore >= 80 ? 'Excellent' : aiScore >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </div>

          {/* Warning for Low Score */}
          {aiScore < 60 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Your current AI score may affect loan approval. Consider improving your profile before applying.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.amount || !formData.purpose || !formData.idFile}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            Submit for AI Review
          </button>
        </form>
      </div>

      {/* Terms */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          By submitting this application, you agree to our{' '}
          <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoanApplication;