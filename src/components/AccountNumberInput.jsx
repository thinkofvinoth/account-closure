import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const AccountNumberInput = ({ onVerify, onCancel }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [showNumber, setShowNumber] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const formatAccountNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 12 digits and format as XXXX-XXXX-XXXX
    const limited = digits.slice(0, 12);
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1-');
    
    return formatted;
  };

  const handleInputChange = (e) => {
    const formatted = formatAccountNumber(e.target.value);
    setAccountNumber(formatted);
    setError('');
  };

  const validateAccountNumber = (number) => {
    const digits = number.replace(/\D/g, '');
    
    if (digits.length !== 12) {
      return 'Account number must be 12 digits';
    }
    
    // Mock validation - check against known test accounts
    const validAccounts = ['123456789012', '987654321098', '555666777888'];
    if (!validAccounts.includes(digits)) {
      return 'Account number not found or invalid';
    }
    
    return null;
  };

  const handleVerify = async () => {
    const validationError = validateAccountNumber(accountNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const digits = accountNumber.replace(/\D/g, '');
      const accountData = {
        accountNumber: digits,
        maskedNumber: `****-****-${digits.slice(-4)}`,
        accountType: digits === '123456789012' ? 'Savings Account' : 
                    digits === '987654321098' ? 'Checking Account' : 'Business Account',
        balance: '$0.00',
        status: 'Active',
        lastActivity: '2024-01-15'
      };
      
      onVerify(accountData);
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && accountNumber.replace(/\D/g, '').length === 12) {
      handleVerify();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl max-w-lg"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-4"
        >
          <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl shadow-lg">
            <CreditCard className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Account Verification
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Please enter your 12-digit account number to proceed with closure
        </p>
      </div>

      {/* Account Number Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Account Number
        </label>
        <div className="relative">
          <input
            type={showNumber ? "text" : "password"}
            value={accountNumber}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="XXXX-XXXX-XXXX"
            maxLength={14} // Including dashes
            className={`w-full px-4 py-4 pr-12 text-lg font-mono rounded-xl border-2 transition-all duration-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm
              ${error 
                ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200'
              }
              focus:outline-none focus:ring-4 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isVerifying}
          />
          <button
            type="button"
            onClick={() => setShowNumber(!showNumber)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            disabled={isVerifying}
          >
            {showNumber ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center space-x-2 text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Success Indicator */}
        {accountNumber.replace(/\D/g, '').length === 12 && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center space-x-2 text-green-600 dark:text-green-400"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Valid format</span>
          </motion.div>
        )}
      </div>

      {/* Test Account Info */}
      <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Test Account Numbers:
        </h4>
        <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300 font-mono">
          <div>123456789012 - Savings Account</div>
          <div>987654321098 - Checking Account</div>
          <div>555666777888 - Business Account</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          disabled={isVerifying}
          className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-300 font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleVerify}
          disabled={isVerifying || accountNumber.replace(/\D/g, '').length !== 12}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isVerifying ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Verify Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};