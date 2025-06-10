import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, User, CreditCard, FileText, Shield, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/cn';

const CLOSURE_STEPS = [
  {
    id: 'verification',
    title: 'Identity Verification',
    description: 'Verifying account details and identity',
    icon: User,
    color: 'blue'
  },
  {
    id: 'settlement',
    title: 'Account Settlement',
    description: 'Processing final transactions and balances',
    icon: CreditCard,
    color: 'purple'
  },
  {
    id: 'completion',
    title: 'Account Closure',
    description: 'Finalizing closure and data archival',
    icon: FileText,
    color: 'green'
  },
];

const StepIndicator = ({ step, index, currentStepIndex, completedSteps }) => {
  const isCompleted = completedSteps.includes(step.id);
  const isCurrent = currentStepIndex === index;
  const isUpcoming = index > currentStepIndex;
  
  return (
    <div className="flex items-center flex-1">
      {/* Step Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full border-3 transition-all duration-500 z-10",
          isCompleted && "bg-blue-500 border-blue-500",
          isCurrent && "bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/30",
          isUpcoming && "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        )}
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle className="h-5 w-5 text-white" />
          </motion.div>
        ) : isCurrent ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-white font-bold text-sm"
          >
            {index + 1}
          </motion.div>
        ) : (
          <span className={cn(
            "text-sm font-bold",
            isUpcoming ? "text-gray-400 dark:text-gray-500" : "text-white"
          )}>
            {index + 1}
          </span>
        )}
      </motion.div>

      {/* Connecting Line */}
      {index < CLOSURE_STEPS.length - 1 && (
        <div className="flex-1 h-0.5 mx-3 bg-gray-200 dark:bg-gray-700 relative">
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
    </div>
  );
};

const ProgressBar = ({ currentStepIndex, completedSteps }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
        <span>Account Closure Progress</span>
        <span>{Math.round(((completedSteps.length) / CLOSURE_STEPS.length) * 100)}% Complete</span>
      </div>
      
      {/* Step Indicators with Connecting Lines */}
      <div className="flex items-center">
        {CLOSURE_STEPS.map((step, index) => (
          <StepIndicator
            key={step.id}
            step={step}
            index={index}
            currentStepIndex={currentStepIndex}
            completedSteps={completedSteps}
          />
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between mt-2">
        {CLOSURE_STEPS.map((step, index) => (
          <div key={step.id} className="text-center flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AccountClosureFlow = ({ closureData, onComplete, isLoading }) => {
  const [currentStep, setCurrentStep] = useState('verification');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!closureData || isLoading) return;

    const processSteps = async () => {
      for (let i = 0; i < CLOSURE_STEPS.length; i++) {
        const step = CLOSURE_STEPS[i];
        setCurrentStep(step.id);
        
        // Simulate API processing time
        await new Promise(resolve => setTimeout(resolve, closureData.stepDurations[i] || 2000));
        
        setCompletedSteps(prev => [...prev, step.id]);
        
        if (i === CLOSURE_STEPS.length - 1) {
          setIsProcessing(false);
          setTimeout(() => onComplete?.(), 1000);
        }
      }
    };

    processSteps();
  }, [closureData, onComplete, isLoading]);

  const currentStepIndex = CLOSURE_STEPS.findIndex(step => step.id === currentStep);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white/30 to-white/20 dark:from-gray-800/70 dark:to-gray-900/50 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl p-5 shadow-xl max-w-md"
      >
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-200 border-t-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Initializing Closure
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Setting up secure process...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white/30 to-white/20 dark:from-gray-800/70 dark:to-gray-900/50 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl p-5 shadow-xl max-w-md"
    >
      {/* Compact Header */}
      <div className="text-center mb-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-3"
        >
          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-xl shadow-md">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
          Processing Account Closure
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Account: {closureData?.accountDetails?.maskedNumber || '****-****-XXXX'}
        </p>
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
          {closureData?.accountDetails?.accountType || 'Account'}
        </div>
      </div>

      <ProgressBar currentStepIndex={currentStepIndex} completedSteps={completedSteps} />

      {/* Current Step Details - Compact */}
      <div className="mb-5">
        {CLOSURE_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;
          
          if (!isCurrent && !isCompleted) return null;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 border",
                isCurrent && "bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700",
                isCompleted && "bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                isCompleted && "bg-green-500",
                isCurrent && "bg-blue-500"
              )}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <Icon className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={cn(
                  "font-medium text-sm",
                  isCompleted && "text-green-700 dark:text-green-300",
                  isCurrent && "text-blue-700 dark:text-blue-300"
                )}>
                  {step.title}
                </h4>
                <p className={cn(
                  "text-xs mt-0.5",
                  isCompleted && "text-green-600 dark:text-green-400",
                  isCurrent && "text-blue-600 dark:text-blue-400"
                )}>
                  {step.description}
                </p>
              </div>

              <div className="flex items-center">
                {isCurrent && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-blue-500"
                  >
                    <Clock className="h-4 w-4" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Message - Compact */}
      <AnimatePresence>
        {!isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center space-x-2 mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">
                  Account Closure Completed
                </h4>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Account {closureData?.accountDetails?.maskedNumber} successfully closed
                </p>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 mt-3">
              <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                📧 Confirmation email sent<br/>
                🔒 Data securely archived<br/>
                ✅ Reference: <span className="font-mono font-medium">CLS_{Date.now().toString().slice(-6)}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};