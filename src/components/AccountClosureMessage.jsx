import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, ArrowRight, Shield, Clock, CheckCircle, User } from 'lucide-react';
import { AccountClosureFlow } from './AccountClosureFlow';
import { AccountNumberInput } from './AccountNumberInput';
import { accountClosureApi, mockClosureScenarios } from '../services/accountClosureApi';

export const AccountClosureMessage = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState('initial'); // initial, verify, flow
  const [accountData, setAccountData] = useState(null);
  const [closureData, setClosureData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountVerified = async (verifiedAccountData) => {
    setAccountData(verifiedAccountData);
    setCurrentStep('flow');
    setIsLoading(true);
    
    try {
      // Simulate API call with verified account
      const response = await accountClosureApi.initiateAccountClosure(
        verifiedAccountData.accountNumber, 
        'User request'
      );
      
      // Use mock scenario data based on account type
      let scenarioData;
      if (verifiedAccountData.accountType === 'Business Account') {
        scenarioData = mockClosureScenarios.withDelay;
      } else if (verifiedAccountData.accountType === 'Checking Account') {
        scenarioData = mockClosureScenarios.quick;
      } else {
        scenarioData = mockClosureScenarios.successful;
      }
      
      setClosureData({
        ...response,
        ...scenarioData,
        accountDetails: verifiedAccountData
      });
    } catch (error) {
      console.error('Failed to initiate account closure:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVerification = () => {
    setCurrentStep('verify');
  };

  const handleFlowComplete = () => {
    onComplete?.();
  };

  const handleCancel = () => {
    setCurrentStep('initial');
    setAccountData(null);
    setClosureData(null);
  };

  // Show account verification step
  if (currentStep === 'verify') {
    return (
      <AccountNumberInput 
        onVerify={handleAccountVerified}
        onCancel={handleCancel}
      />
    );
  }

  // Show closure flow
  if (currentStep === 'flow') {
    return (
      <AccountClosureFlow 
        closureData={closureData} 
        onComplete={handleFlowComplete}
        isLoading={isLoading}
      />
    );
  }

  // Show initial message
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl max-w-lg"
    >
      {/* Header Section */}
      <div className="text-center mb-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-4"
        >
          <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-2xl shadow-lg">
            <AlertTriangle className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Account Closure Request
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          I'll guide you through the secure account closure process. First, I need to verify your account details.
        </p>
      </div>

      {/* Requirements Section */}
      <div className="space-y-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Account Verification Required
              </h4>
              <div className="space-y-2">
                {[
                  'Provide your 12-digit account number',
                  'Verify account ownership',
                  'Confirm account details',
                  'Proceed with secure closure'
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800/50 rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
              <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Pre-closure Checklist
              </h4>
              <div className="space-y-2">
                {[
                  'Ensure account balance is zero',
                  'Cancel automatic payments & transfers',
                  'Download important statements',
                  'Update payment methods elsewhere'
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-700 dark:text-green-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Processing Time */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                Processing Time
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Approximately 5-7 minutes for complete closure
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg">
              <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                Important Notice
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Account closure is permanent and cannot be reversed. All data will be securely deleted.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex space-x-3"
      >
        <button
          onClick={() => onComplete?.()}
          className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-300 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleStartVerification}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Verify Account</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
};