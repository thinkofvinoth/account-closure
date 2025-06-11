import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, CreditCard, Shield, FileText, User, Loader2 } from 'lucide-react';
import { accountClosureApi, closureReasons } from '../services/accountClosureApi';

const STEPS = {
  COLLECT_ACCOUNT: 'collect_account',
  VERIFY_STATUS: 'verify_status',
  VALIDATION_FAILED: 'validation_failed',
  ASK_REASON: 'ask_reason',
  PROGRESS_BAR: 'progress_bar',
  COMPLETION: 'completion',
  FINAL_MESSAGE: 'final_message'
};

export const ConversationalAccountClosure = ({ onComplete, onSendMessage }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.COLLECT_ACCOUNT);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [closureReason, setClosureReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressSteps, setProgressSteps] = useState([]);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);
  const [closureId, setClosureId] = useState('');

  // Step 1: Collect Account Number
  const handleAccountNumberSubmit = async (inputAccountNumber) => {
    setIsProcessing(true);
    
    // Validate format first
    const validation = accountClosureApi.validateAccountFormat(inputAccountNumber);
    if (!validation.valid) {
      await onSendMessage(`❌ ${validation.error} Please try again.`);
      setIsProcessing(false);
      return;
    }

    setAccountNumber(validation.cleaned);
    setCurrentStep(STEPS.VERIFY_STATUS);
    
    // Send verification message
    await onSendMessage("🔍 Checking your account status. Please wait...");
    
    try {
      // Step 2: Verify Account Status
      const response = await accountClosureApi.verifyAccount(validation.cleaned);
      setAccountData(response.account);
      
      if (!response.account.eligible) {
        // Step 3: Validation Failed
        setValidationErrors(response.account.issues || []);
        setCurrentStep(STEPS.VALIDATION_FAILED);
        
        let errorMessage = "❌ Unfortunately, we can't proceed because of the following reasons:\n";
        response.account.issues.forEach(issue => {
          errorMessage += `• ${issue}\n`;
        });
        
        await onSendMessage(errorMessage);
        await onSendMessage("Please resolve these issues and try again. Would you like help with that?");
      } else {
        // Account is eligible, proceed to reason collection
        setCurrentStep(STEPS.ASK_REASON);
        await onSendMessage(`✅ Account verified successfully!\n\nAccount: ${response.account.maskedNumber}\nType: ${response.account.accountType}\nStatus: ${response.account.status}`);
        await onSendMessage("Can you please tell us why you are closing your account?");
      }
    } catch (error) {
      await onSendMessage("❌ The account number you entered seems invalid. Please try again.");
    }
    
    setIsProcessing(false);
  };

  // Step 4: Handle Reason Selection
  const handleReasonSubmit = async (reason, custom = '') => {
    setClosureReason(reason);
    setCustomReason(custom);
    setCurrentStep(STEPS.PROGRESS_BAR);
    
    const reasonText = reason === 'other' ? custom : closureReasons.find(r => r.value === reason)?.label;
    await onSendMessage(`Thank you for providing the reason: "${reasonText}"`);
    await onSendMessage("✨ We're now closing your account. Here's what's happening:");
    
    // Step 5: Start Progress Bar Process
    try {
      const closureProcess = await accountClosureApi.processAccountClosure(accountNumber, reasonText);
      setProgressSteps(closureProcess.steps);
      setClosureId(closureProcess.closureId);
      
      // Process each step with delays
      for (let i = 0; i < closureProcess.steps.length; i++) {
        const step = closureProcess.steps[i];
        setCurrentProgressStep(i);
        
        await onSendMessage(`[Progress Step ${step.id}/6] ${step.name}...`);
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }
      
      // Step 6: Completion
      setCurrentStep(STEPS.COMPLETION);
      await onSendMessage(`🎉 Your account has been successfully closed.`);
      await onSendMessage(`Here is your Closure ID: ${closureProcess.closureId}`);
      await onSendMessage("Save this for your records. Is there anything else I can help you with?");
      
      // Final Touch
      setTimeout(async () => {
        setCurrentStep(STEPS.FINAL_MESSAGE);
        await onSendMessage("Thank you for banking with us. Your feedback helps us improve. Goodbye! 👋");
        onComplete?.();
      }, 3000);
      
    } catch (error) {
      await onSendMessage("❌ An error occurred during the closure process. Please try again later.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Account Number Collection Interface */}
      {currentStep === STEPS.COLLECT_ACCOUNT && (
        <AccountNumberInput 
          onSubmit={handleAccountNumberSubmit}
          isProcessing={isProcessing}
        />
      )}

      {/* Reason Selection Interface */}
      {currentStep === STEPS.ASK_REASON && (
        <ReasonSelection 
          onSubmit={handleReasonSubmit}
          accountData={accountData}
        />
      )}

      {/* Progress Bar Visualization */}
      {currentStep === STEPS.PROGRESS_BAR && (
        <ProgressVisualization 
          steps={progressSteps}
          currentStep={currentProgressStep}
        />
      )}

      {/* Completion Summary */}
      {currentStep === STEPS.COMPLETION && (
        <CompletionSummary 
          closureId={closureId}
          accountData={accountData}
          reason={closureReason === 'other' ? customReason : closureReasons.find(r => r.value === closureReason)?.label}
        />
      )}
    </div>
  );
};

// Account Number Input Component
const AccountNumberInput = ({ onSubmit, isProcessing }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSubmit(input.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
          <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h4 className="font-semibold text-blue-800 dark:text-blue-200">Account Number Required</h4>
          <p className="text-sm text-blue-600 dark:text-blue-300">Please enter your account number to begin</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your account number (12-16 digits)"
          disabled={isProcessing}
          className="w-full px-3 py-2 text-sm border border-blue-200 dark:border-blue-700 rounded-lg bg-white/60 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        
        <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <p><strong>Test Account Numbers:</strong></p>
          <p>✅ 123456789012 - Valid account</p>
          <p>❌ 111222333444 - Outstanding balance</p>
          <p>❌ 999888777666 - Recurring payments</p>
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Submit Account Number</span>
          )}
        </button>
      </form>
    </motion.div>
  );
};

// Reason Selection Component
const ReasonSelection = ({ onSubmit, accountData }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customText, setCustomText] = useState('');

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, customText);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/50"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
          <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-semibold text-green-800 dark:text-green-200">Closure Reason</h4>
          <p className="text-sm text-green-600 dark:text-green-300">Help us understand why you're closing your account</p>
        </div>
      </div>

      <div className="space-y-3">
        {closureReasons.map((reason) => (
          <label key={reason.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="reason"
              value={reason.value}
              checked={selectedReason === reason.value}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-green-700 dark:text-green-300">{reason.label}</span>
          </label>
        ))}
        
        {selectedReason === 'other' && (
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Please specify your reason..."
            className="w-full px-3 py-2 text-sm border border-green-200 dark:border-green-700 rounded-lg bg-white/60 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          />
        )}
        
        <button
          onClick={handleSubmit}
          disabled={!selectedReason || (selectedReason === 'other' && !customText.trim())}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with Closure
        </button>
      </div>
    </motion.div>
  );
};

// Progress Visualization Component
const ProgressVisualization = ({ steps, currentStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
          <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h4 className="font-semibold text-purple-800 dark:text-purple-200">Account Closure in Progress</h4>
          <p className="text-sm text-purple-600 dark:text-purple-300">Processing your request securely</p>
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
              index < currentStep ? 'bg-green-500 text-white' :
              index === currentStep ? 'bg-purple-500 text-white' :
              'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {index < currentStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : index === currentStep ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                step.id
              )}
            </div>
            <span className={`text-sm ${
              index <= currentStep ? 'text-purple-700 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
        />
      </div>
    </motion.div>
  );
};

// Completion Summary Component
const CompletionSummary = ({ closureId, accountData, reason }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/50"
    >
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Account Successfully Closed</h4>
        
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Closure ID:</span>
            <span className="font-mono font-semibold text-green-700 dark:text-green-300">{closureId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Account:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{accountData?.maskedNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Reason:</span>
            <span className="text-gray-700 dark:text-gray-300">{reason}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Date:</span>
            <span className="text-gray-700 dark:text-gray-300">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <p className="text-xs text-green-600 dark:text-green-400 mt-3">
          📧 Confirmation email sent • 🔒 Data securely archived • ✅ Process completed
        </p>
      </div>
    </motion.div>
  );
};