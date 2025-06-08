import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, User, CreditCard, FileText, Shield, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/cn';

const CLOSURE_STEPS = [
  {
    id: 'verification',
    title: 'Identity Verification',
    description: 'Verifying your account details and identity',
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

const StepIcon = ({ step, currentStep, isCompleted }) => {
  const Icon = step.icon;
  
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  };
  
  if (isCompleted) {
    return (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg"
      >
        <CheckCircle className="h-7 w-7 text-white" />
      </motion.div>
    );
  }
  
  if (currentStep === step.id) {
    return (
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${colorClasses[step.color]} shadow-lg`}
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-7 w-7 rounded-full border-3 border-white border-t-transparent"
        />
      </motion.div>
    );
  }
  
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 shadow-md">
      <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
    </div>
  );
};

const ProgressBar = ({ currentStepIndex, totalSteps }) => {
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        <span>Closure Progress</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
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
        className="bg-gradient-to-br from-white/30 to-white/20 dark:from-gray-800/70 dark:to-gray-900/50 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-2xl p-8 shadow-2xl max-w-lg"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Initializing Account Closure
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Setting up secure closure process...
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
      className="bg-gradient-to-br from-white/30 to-white/20 dark:from-gray-800/70 dark:to-gray-900/50 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-2xl p-8 shadow-2xl max-w-lg"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-4"
        >
          <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl shadow-lg">
            <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Processing Account Closure
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          Account: {closureData?.accountDetails?.maskedNumber || '****-****-XXXX'}
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
          {closureData?.accountDetails?.accountType || 'Account'}
        </div>
      </div>

      <ProgressBar currentStepIndex={currentStepIndex} totalSteps={CLOSURE_STEPS.length} />

      {/* Steps */}
      <div className="space-y-6">
        {CLOSURE_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={cn(
                "flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 border",
                isCurrent && "bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700 shadow-md",
                isCompleted && "bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 shadow-md",
                !isCompleted && !isCurrent && "bg-white/20 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700"
              )}
            >
              <StepIcon step={step} currentStep={currentStep} isCompleted={isCompleted} />
              
              <div className="flex-1">
                <h4 className={cn(
                  "font-semibold text-lg",
                  isCompleted && "text-green-700 dark:text-green-300",
                  isCurrent && "text-blue-700 dark:text-blue-300",
                  !isCompleted && !isCurrent && "text-gray-700 dark:text-gray-300"
                )}>
                  {step.title}
                </h4>
                <p className={cn(
                  "text-sm mt-1",
                  isCompleted && "text-green-600 dark:text-green-400",
                  isCurrent && "text-blue-600 dark:text-blue-400",
                  !isCompleted && !isCurrent && "text-gray-500 dark:text-gray-400"
                )}>
                  {step.description}
                </p>
              </div>

              <div className="flex items-center">
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-green-500"
                  >
                    <CheckCircle className="h-6 w-6" />
                  </motion.div>
                )}
                
                {isCurrent && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-blue-500"
                  >
                    <Clock className="h-6 w-6" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {!isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl border border-green-200 dark:border-green-800 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <div>
                <h4 className="font-bold text-green-800 dark:text-green-200 text-lg">
                  Account Closure Completed
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Account {closureData?.accountDetails?.maskedNumber} has been successfully closed
                </p>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 mt-4">
              <p className="text-sm text-green-700 dark:text-green-300">
                📧 Confirmation email sent to your registered address<br/>
                🔒 All data has been securely archived<br/>
                ✅ Account closure reference: <span className="font-mono font-semibold">CLS_{Date.now().toString().slice(-6)}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};