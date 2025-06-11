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

const ProgressBar = ({ currentStep, completedSteps }) => {
  const currentStepIndex = CLOSURE_STEPS.findIndex(step => step.id === currentStep);
  
  return (
    <div className="mb-4 p-3 bg-white/10 dark:bg-gray-800/30 rounded-lg backdrop-blur-sm">
      <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
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
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-500",
                    isCompleted && "bg-green-500 border-green-500",
                    isCurrent && "bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/30",
                    isUpcoming && "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-3 w-3 text-white" />
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon className="h-3 w-3 text-white" />
                    </motion.div>
                  ) : (
                    <Icon className={cn(
                      "h-3 w-3",
                      isUpcoming ? "text-gray-400 dark:text-gray-500" : "text-white"
                    )} />
                  )}
                </motion.div>
                <span className={cn(
                  "text-xs mt-1 text-center max-w-12",
                  isCompleted && "text-green-600 dark:text-green-400",
                  isCurrent && "text-blue-600 dark:text-blue-400",
                  isUpcoming && "text-gray-400 dark:text-gray-500"
                )}>
                  {step.title.split(' ')[0]}
                </span>
              </div>
              
              {index < CLOSURE_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 bg-gray-200 dark:bg-gray-700 relative">
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

export const ConversationalAccountClosure = ({ onSendMessage }) => {
  const [currentStep, setCurrentStep] = useState('greeting');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [closureReason, setClosureReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [closureId, setClosureId] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [waitingForInput, setWaitingForInput] = useState(false);

  useEffect(() => {
    // Start with greeting message
    setTimeout(() => {
      onSendMessage("Hello! I'm here to help you close your account. This process typically takes 5-7 minutes. Before we begin, please note that you'll need:\n\n• Your account number\n• No outstanding payments\n• No active recurring payments\n\nWould you like to proceed?");
    }, 500);
  }, []);

  const formatAccountNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 12);
    return limited.replace(/(\d{2})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4');
  };

  const validateAccountNumber = (number) => {
    const pattern = /^\d{2}-\d{4}-\d{4}-\d{2}$/;
    return pattern.test(number);
  };

  const handleUserResponse = async (response) => {
    const lowerResponse = response.toLowerCase();

    switch (currentStep) {
      case 'greeting':
        if (lowerResponse.includes('yes') || lowerResponse.includes('proceed') || lowerResponse.includes('continue')) {
          setCurrentStep('verification');
          setTimeout(() => {
            onSendMessage("Please enter your 12-digit account number in the format: XX-XXXX-XXXX-XX\n\nTest Account Numbers:\n✅ 12-3456-7890-12 (Valid)\n❌ 98-7654-3210-98 (Outstanding Payments)\n❌ 55-5666-7778-88 (Recurring Payments)\n❌ 11-1222-3334-44 (Inactive)");
          }, 1000);
        } else {
          setTimeout(() => {
            onSendMessage("No problem! If you change your mind and want to close your account, just let me know. Is there anything else I can help you with?");
          }, 1000);
        }
        break;

      case 'verification':
        const formatted = formatAccountNumber(response);
        setAccountNumber(formatted);
        
        if (!validateAccountNumber(formatted)) {
          setTimeout(() => {
            onSendMessage("I notice the format isn't quite right. Your account number should look like: 12-3456-7890-12. Please try again.");
          }, 1000);
          return;
        }

        setIsProcessing(true);
        setCurrentStep('status-check');
        
        setTimeout(async () => {
          onSendMessage("Thank you. I'm now checking your account status. This will take about 30 seconds...");
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 2000));

          const account = MOCK_ACCOUNTS[formatted];
          if (!account) {
            onSendMessage('Account not found. Please check your account number and try again.');
            setCurrentStep('verification');
            setIsProcessing(false);
            return;
          }

          setAccountData(account);
          setCompletedSteps(['verification']);

          // Check account status
          if (account.status !== 'active' || account.hasOutstandingPayments || account.hasRecurringPayments) {
            setCurrentStep('status-issues');
            let issues = [];
            if (account.status !== 'active') issues.push('• Account is inactive/blocked');
            if (account.hasOutstandingPayments) issues.push(`• Outstanding payments: ${account.outstandingAmount}`);
            if (account.hasRecurringPayments) issues.push(`• Active recurring payments: ${account.recurringPayments?.join(', ')}`);
            
            onSendMessage(`Unfortunately, we can't proceed because of the following reasons:\n\n${issues.join('\n')}\n\nPlease resolve the issues and try again. Would you like help with that?`);
          } else {
            setCurrentStep('reason');
            setCompletedSteps(['verification', 'status-check']);
            onSendMessage("Your account is eligible for closure. To help us improve our services, please select your primary reason for closing:\n\n1️⃣ No longer needed\n2️⃣ High fees\n3️⃣ Switching to competitor\n4️⃣ Other (please specify)\n\nPlease type the number (1-4) or the reason:");
          }
          
          setIsProcessing(false);
        }, 1000);
        break;

      case 'status-issues':
        if (lowerResponse.includes('help') || lowerResponse.includes('yes')) {
          setTimeout(() => {
            onSendMessage("I'd be happy to help you resolve these issues. Please contact our customer service team at 1-800-BANK-HELP or visit your nearest branch. Once resolved, you can restart the closure process.");
          }, 1000);
        } else {
          setTimeout(() => {
            onSendMessage("Understood. Please resolve the issues and return when you're ready to proceed with the closure. Is there anything else I can help you with?");
          }, 1000);
        }
        break;

      case 'reason':
        let reason = '';
        if (response === '1' || lowerResponse.includes('no longer needed')) {
          reason = 'no-longer-needed';
        } else if (response === '2' || lowerResponse.includes('high fees')) {
          reason = 'high-fees';
        } else if (response === '3' || lowerResponse.includes('switching') || lowerResponse.includes('competitor')) {
          reason = 'switching-competitor';
        } else if (response === '4' || lowerResponse.includes('other')) {
          reason = 'other';
          setCustomReason(response);
        } else {
          setTimeout(() => {
            onSendMessage("Please select a valid option (1-4) or specify your reason clearly.");
          }, 1000);
          return;
        }

        setClosureReason(reason);
        setCurrentStep('confirmation');
        setCompletedSteps(['verification', 'status-check', 'reason']);
        
        setTimeout(() => {
          onSendMessage("Before proceeding with the closure, please confirm:\n\n• All automatic payments have been redirected\n• All pending transactions have cleared\n• You've downloaded any statements you need\n\n⚠️ Important: Account closure is permanent and cannot be undone.\n\nType 'CONFIRM' to proceed:");
        }, 1000);
        break;

      case 'confirmation':
        if (response.toUpperCase() === 'CONFIRM') {
          setCurrentStep('processing');
          setCompletedSteps(['verification', 'status-check', 'reason', 'confirmation']);
          setIsProcessing(true);

          setTimeout(async () => {
            onSendMessage("Thanks. We're now closing your account. Here's what's happening:\n\n[Progress Step 1/4] Verifying final details...\n[Progress Step 2/4] Processing closure...\n[Progress Step 3/4] Generating documentation...\n[Progress Step 4/4] Creating confirmation...");

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
            setCurrentStep('completion');
            setCompletedSteps(['verification', 'status-check', 'reason', 'confirmation', 'processing', 'completion']);
            setIsProcessing(false);

            onSendMessage(`🎉 Your account has been successfully closed.\n\nHere is your Closure ID: ${id}\n\nSave this for your records. A confirmation email has been sent to your registered email address.\n\nThank you for banking with us. Your feedback helps us improve. Goodbye!\n\nIs there anything else I can help you with?`);
          }, 1000);
        } else {
          setTimeout(() => {
            onSendMessage("Please type 'CONFIRM' exactly to proceed with the account closure, or let me know if you'd like to cancel.");
          }, 1000);
        }
        break;

      default:
        setTimeout(() => {
          onSendMessage("I'm not sure how to help with that. Is there anything else I can assist you with?");
        }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl p-4 shadow-xl max-w-md"
    >
      {(currentStep !== 'greeting' && currentStep !== 'status-issues') && (
        <ProgressBar currentStep={currentStep} completedSteps={completedSteps} />
      )}
      
      <div className="text-center">
        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg inline-block mb-3">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Account Closure Assistant
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentStep === 'greeting' && "Ready to help you close your account"}
          {currentStep === 'verification' && "Please provide your account number"}
          {currentStep === 'status-check' && "Checking account status..."}
          {currentStep === 'status-issues' && "Account issues found"}
          {currentStep === 'reason' && "Please select closure reason"}
          {currentStep === 'confirmation' && "Final confirmation required"}
          {currentStep === 'processing' && "Processing your request..."}
          {currentStep === 'completion' && "Account closure completed!"}
        </p>
      </div>

      {isProcessing && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
        </div>
      )}
    </motion.div>
  );
};