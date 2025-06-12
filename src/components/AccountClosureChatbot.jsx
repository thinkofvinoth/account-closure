import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  CreditCard, 
  FileText, 
  Shield,
  XCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { cn } from '../utils/cn';
import { StreamingMessage } from './StreamingMessage';

const CLOSURE_STEPS = [
  { id: 'verification', title: 'Account Verification', icon: User },
  { id: 'status-check', title: 'Status Check', icon: Shield },
  { id: 'reason', title: 'Closure Reason', icon: FileText },
  { id: 'confirmation', title: 'Confirmation', icon: CheckCircle },
  { id: 'processing', title: 'Processing', icon: Clock },
  { id: 'completion', title: 'Completion', icon: CheckCircle }
];

const MOCK_ACCOUNTS = {
  '12-3456-7890-12': {
    status: 'active',
    hasOutstandingPayments: false,
    hasRecurringPayments: false,
    accountType: 'Savings Account',
    balance: '$0.00'
  },
  '98-7654-3210-98': {
    status: 'active',
    hasOutstandingPayments: true,
    hasRecurringPayments: false,
    accountType: 'Checking Account',
    balance: '$150.00',
    outstandingAmount: '$150.00'
  },
  '55-5666-7778-88': {
    status: 'active',
    hasOutstandingPayments: false,
    hasRecurringPayments: true,
    accountType: 'Business Account',
    balance: '$0.00',
    recurringPayments: ['Netflix Subscription', 'Gym Membership']
  },
  '11-1222-3334-44': {
    status: 'inactive',
    hasOutstandingPayments: false,
    hasRecurringPayments: false,
    accountType: 'Savings Account',
    balance: '$0.00'
  }
};

// Mock streaming responses for different steps
const STREAMING_RESPONSES = {
  verification: [
    "Thank you for providing your account number.",
    "I'm now verifying your account details with our secure system.",
    "This process ensures we have the correct account information before proceeding.",
    "Verification complete! Your account has been successfully identified."
  ],
  statusCheck: [
    "Now performing a comprehensive status check on your account.",
    "Checking for any outstanding payments or pending transactions.",
    "Reviewing active recurring payments and subscriptions.",
    "Verifying account balance and recent activity.",
    "Status check complete! Your account is eligible for closure."
  ],
  statusIssues: [
    "I've completed the account review and found some items that need attention.",
    "These issues must be resolved before we can proceed with the closure process.",
    "I can help you understand each issue and provide guidance on resolution.",
    "Would you like assistance resolving these items, or would you prefer to handle them separately?"
  ],
  reasonCollection: [
    "Thank you for selecting your closure reason.",
    "This feedback helps us improve our services for future customers.",
    "Your input is valuable and will be shared with our product team.",
    "Now let's proceed to the final confirmation step."
  ],
  finalConfirmation: [
    "We're now at the final confirmation stage.",
    "Please take a moment to review the important points listed above.",
    "Remember that account closure is permanent and cannot be undone.",
    "Once you type 'CONFIRM', we'll immediately begin processing your closure request."
  ],
  processing: [
    "Your closure request has been received and is now being processed.",
    "Our secure systems are handling your request with the highest priority.",
    "All account data is being properly archived according to regulatory requirements.",
    "Final documentation is being generated for your records."
  ],
  completion: [
    "Congratulations! Your account closure has been completed successfully.",
    "All processes have been finalized and your account is now officially closed.",
    "A confirmation email with all details has been sent to your registered email address.",
    "Thank you for being our valued customer. We wish you all the best!"
  ]
};

const ProgressBar = ({ currentStep, completedSteps }) => {
  const currentStepIndex = CLOSURE_STEPS.findIndex(step => step.id === currentStep);
  
  return (
    <div className="mb-6 p-4 bg-white/10 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
      <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
        <span>Account Closure Progress</span>
        <span>{Math.round((completedSteps.length / CLOSURE_STEPS.length) * 100)}% Complete</span>
      </div>
      
      <div className="flex items-center justify-between">
        {CLOSURE_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = index > currentStepIndex;
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500",
                    isCompleted && "bg-green-500 border-green-500",
                    isCurrent && "bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/30",
                    isUpcoming && "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </motion.div>
                  ) : (
                    <Icon className={cn(
                      "h-4 w-4",
                      isUpcoming ? "text-gray-400 dark:text-gray-500" : "text-white"
                    )} />
                  )}
                </motion.div>
                <span className={cn(
                  "text-xs mt-1 text-center max-w-16",
                  isCompleted && "text-green-600 dark:text-green-400",
                  isCurrent && "text-blue-600 dark:text-blue-400",
                  isUpcoming && "text-gray-400 dark:text-gray-500"
                )}>
                  {step.title}
                </span>
              </div>
              
              {index < CLOSURE_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-gray-700 relative">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: isCompleted ? "100%" : isCurrent ? "50%" : "0%" 
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="h-full bg-blue-500 absolute top-0 left-0"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const AccountClosureChatbot = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState('verification');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [closureReason, setClosureReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [closureId, setClosureId] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showStreamingMessage, setShowStreamingMessage] = useState(false);

  const formatAccountNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 12);
    return limited.replace(/(\d{2})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4');
  };

  const validateAccountNumber = (number) => {
    const pattern = /^\d{2}-\d{4}-\d{4}-\d{2}$/;
    return pattern.test(number);
  };

  const simulateStreamingResponse = async (responseKey, onComplete) => {
    const responses = STREAMING_RESPONSES[responseKey];
    if (!responses) return;

    setIsStreaming(true);
    setShowStreamingMessage(true);
    setStreamingMessage('');

    let fullMessage = '';
    
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      
      // Add break tag between responses (except for the first one)
      if (i > 0) {
        fullMessage += '<br /><br />';
        setStreamingMessage(fullMessage);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Stream each character of the current response
      for (let j = 0; j < response.length; j++) {
        fullMessage += response[j];
        setStreamingMessage(fullMessage);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Pause between responses
      if (i < responses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    setIsStreaming(false);
    
    // Keep the message visible for a moment before calling onComplete
    setTimeout(() => {
      setShowStreamingMessage(false);
      if (onComplete) onComplete();
    }, 1500);
  };

  const handleAccountNumberSubmit = async () => {
    if (!validateAccountNumber(accountNumber)) {
      setError("I notice the format isn't quite right. Your account number should look like: 12-3456-7890-12. Please try again.");
      return;
    }

    setError('');
    setIsProcessing(true);

    // Start streaming response for verification
    await simulateStreamingResponse('verification', async () => {
      setCurrentStep('status-check');

      // Simulate API delay for status check
      await new Promise(resolve => setTimeout(resolve, 1000));

      const account = MOCK_ACCOUNTS[accountNumber];
      if (!account) {
        setError('Account not found. Please check your account number and try again.');
        setIsProcessing(false);
        setCurrentStep('verification');
        return;
      }

      setAccountData(account);
      setCompletedSteps(['verification']);

      // Stream status check response
      await simulateStreamingResponse('statusCheck', () => {
        // Check account status
        if (account.status !== 'active' || account.hasOutstandingPayments || account.hasRecurringPayments) {
          simulateStreamingResponse('statusIssues', () => {
            setCurrentStep('status-issues');
            setIsProcessing(false);
          });
        } else {
          setCurrentStep('reason');
          setCompletedSteps(['verification', 'status-check']);
          setIsProcessing(false);
        }
      });
    });
  };

  const handleReasonSubmit = async () => {
    if (!closureReason) {
      setError('Please select a reason for closing your account.');
      return;
    }
    setError('');
    setIsProcessing(true);

    await simulateStreamingResponse('reasonCollection', () => {
      setCurrentStep('confirmation');
      setCompletedSteps(['verification', 'status-check', 'reason']);
      setIsProcessing(false);
    });
  };

  const handleConfirmation = async () => {
    setIsProcessing(true);
    
    await simulateStreamingResponse('finalConfirmation', async () => {
      setCurrentStep('processing');
      setCompletedSteps(['verification', 'status-check', 'reason', 'confirmation']);

      const processingSteps = [
        'Verifying final details',
        'Processing closure',
        'Generating documentation',
        'Creating confirmation'
      ];

      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const id = `CSW-${Math.floor(Math.random() * 9000) + 1000}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      setClosureId(id);

      await simulateStreamingResponse('completion', () => {
        setCurrentStep('completion');
        setCompletedSteps(['verification', 'status-check', 'reason', 'confirmation', 'processing', 'completion']);
        setIsProcessing(false);
      });
    });
  };

  const renderAccountVerification = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <ProgressBar currentStep={currentStep} completedSteps={completedSteps} />
      
      {showStreamingMessage && (
        <StreamingMessage 
          message={streamingMessage}
          isStreaming={isStreaming}
        />
      )}
      
      <div className="text-center mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl inline-block mb-4">
          <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Account Verification
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please enter your 12-digit account number to begin the closure process.
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => {
            const formatted = formatAccountNumber(e.target.value);
            setAccountNumber(formatted);
            setError('');
          }}
          placeholder="12-3456-7890-12"
          className="w-full px-4 py-3 text-center font-mono text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800/50 focus:outline-none transition-all"
          disabled={isProcessing}
          autoFocus
        />
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Test Account Numbers:</h4>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 font-mono">
          <div>✅ 12-3456-7890-12 (Valid)</div>
          <div>❌ 98-7654-3210-98 (Outstanding Payments)</div>
          <div>❌ 55-5666-7778-88 (Recurring Payments)</div>
          <div>❌ 11-1222-3334-44 (Inactive)</div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => onComplete?.()}
          className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-300 font-medium"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          onClick={handleAccountNumberSubmit}
          disabled={!validateAccountNumber(accountNumber) || isProcessing}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
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

  const renderStatusIssues = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <ProgressBar currentStep={currentStep} completedSteps={completedSteps} />
      
      {showStreamingMessage && (
        <StreamingMessage 
          message={streamingMessage}
          isStreaming={isStreaming}
        />
      )}
      
      <div className="text-center mb-4">
        <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 rounded-xl inline-block mb-4">
          <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Account Issues Found
        </h3>
      </div>

      <div className="bg-red-50/50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/50">
        <p className="text-sm text-red-700 dark:text-red-300 mb-3">
          I've found the following that need attention before we can proceed:
        </p>
        <ul className="space-y-2 text-sm">
          {accountData?.status !== 'active' && (
            <li className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>Account is inactive/blocked</span>
            </li>
          )}
          {accountData?.hasOutstandingPayments && (
            <li className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>Outstanding payments: {accountData.outstandingAmount}</span>
            </li>
          )}
          {accountData?.hasRecurringPayments && (
            <li className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>Active recurring payments: {accountData.recurringPayments?.join(', ')}</span>
            </li>
          )}
        </ul>
      </div>

      <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Would you like assistance resolving these items?
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => {
            setCurrentStep('verification');
            setAccountNumber('');
            setAccountData(null);
            setCompletedSteps([]);
            setError('');
          }}
          className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-300 font-medium"
        >
          Try Again
        </button>
        <button
          onClick={() => onComplete?.()}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium"
        >
          Get Help
        </button>
      </div>
    </motion.div>
  );

  const renderClosureReason = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <ProgressBar currentStep={currentStep} completedSteps={completedSteps} />
      
      {showStreamingMessage && (
        <StreamingMessage 
          message={streamingMessage}
          isStreaming={isStreaming}
        />
      )}
      
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Closure Reason
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your account is eligible for closure. To help us improve our services, please select your primary reason for closing:
        </p>
      </div>

      <div className="space-y-3">
        {[
          { value: 'no-longer-needed', label: '1️⃣ No longer needed' },
          { value: 'high-fees', label: '2️⃣ High fees' },
          { value: 'switching-competitor', label: '3️⃣ Switching to competitor' },
          { value: 'other', label: '4️⃣ Other (please specify)' }
        ].map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
              closureReason === option.value
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
            )}
          >
            <input
              type="radio"
              name="reason"
              value={option.value}
              checked={closureReason === option.value}
              onChange={(e) => setClosureReason(e.target.value)}
              className="text-blue-500"
              disabled={isProcessing}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
          </label>
        ))}
      </div>

      {closureReason === 'other' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Please specify your reason..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800/50 focus:outline-none transition-all resize-none"
            rows={3}
            disabled={isProcessing}
          />
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}

      <button
        onClick={handleReasonSubmit}
        disabled={!closureReason || (closureReason === 'other' && !customReason.trim()) || isProcessing}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <ProgressBar currentStep={currentStep} completedSteps={completedSteps} />
      
      {showStreamingMessage && (
        <StreamingMessage 
          message={streamingMessage}
          isStreaming={isStreaming}
        />
      )}
      
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Final Confirmation
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Before proceeding with the closure, please confirm:
        </p>
      </div>

      <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
        <ul className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
          <li className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>All automatic payments have been redirected</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>All pending transactions have cleared</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>You've downloaded any statements you need</span>
          </li>
        </ul>
      </div>

      <div className="bg-red-50/50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/50">
        <p className="text-sm text-red-700 dark:text-red-300 font-medium">
          ⚠️ Important: Account closure is permanent and cannot be undone.
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Type 'CONFIRM' to proceed"
          className="w-full px-4 py-3 text-center font-mono text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800/50 focus:outline-none transition-all"
          onChange={(e) => {
            if (e.target.value.toUpperCase() === 'CONFIRM') {
              handleConfirmation();
            }
          }}
          disabled={isProcessing}
        />
      </div>
    </motion.div>
  );

  const renderProcessing = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <ProgressBar currentStep={currentStep} completedSteps={completedSteps} />
      
      {showStreamingMessage && (
        <StreamingMessage 
          message={streamingMessage}
          isStreaming={isStreaming}
        />
      )}
      
      <div className="text-center mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl inline-block mb-4">
          <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Processing Your Request
        </h3>
      </div>

      <div className="space-y-3">
        {[
          'Verifying final details',
          'Processing closure',
          'Generating documentation',
          'Creating confirmation'
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: index <= processingStep ? 1 : 0.5,
              scale: index === processingStep ? 1.02 : 1
            }}
            className={cn(
              "flex items-center space-x-3 p-3 rounded-xl transition-all",
              index <= processingStep 
                ? "bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50"
                : "bg-gray-50/50 dark:bg-gray-800/30"
            )}
          >
            {index < processingStep ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : index === processingStep ? (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            ) : (
              <Clock className="h-5 w-5 text-gray-400" />
            )}
            <span className={cn(
              "text-sm",
              index <= processingStep 
                ? "text-gray-700 dark:text-gray-300" 
                : "text-gray-500 dark:text-gray-500"
            )}>
              {step}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCompletion = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <ProgressBar currentStep={currentStep} completedSteps={completedSteps} />
      
      {showStreamingMessage && (
        <StreamingMessage 
          message={streamingMessage}
          isStreaming={isStreaming}
        />
      )}
      
      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl inline-block mb-4"
        >
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          ✅ Account Closure Complete!
        </h3>
      </div>

      <div className="bg-green-50/50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/50">
        <div className="text-center space-y-3">
          <p className="text-sm text-green-700 dark:text-green-300">
            Your Closure Reference:
          </p>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
            <span className="font-mono text-lg font-bold text-green-600 dark:text-green-400">
              {closureId}
            </span>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>

      <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
        <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
          Please save your closure reference for future correspondence.
        </p>
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Is there anything else you need assistance with?
        </p>
      </div>

      <button
        onClick={() => onComplete?.()}
        className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 font-medium"
      >
        Close
      </button>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-br from-white/30 to-white/20 dark:from-gray-800/70 dark:to-gray-900/50 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl p-5 shadow-xl max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {currentStep === 'verification' && renderAccountVerification()}
        {currentStep === 'status-issues' && renderStatusIssues()}
        {currentStep === 'reason' && renderClosureReason()}
        {currentStep === 'confirmation' && renderConfirmation()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'completion' && renderCompletion()}
      </AnimatePresence>
    </div>
  );
};