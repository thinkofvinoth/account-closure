// Enhanced Mock API service for account closure with comprehensive scenarios
export const accountClosureApi = {
  // Simulate account verification with detailed validation
  verifyAccount: async (accountNumber) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced mock account database with various scenarios
    const accounts = {
      // Valid accounts - ready for closure
      '123456789012': {
        accountNumber: '123456789012',
        maskedNumber: '****-****-9012',
        accountType: 'Savings Account',
        balance: '$0.00',
        status: 'Active',
        lastActivity: '2024-01-15',
        customerName: 'John Doe',
        eligible: true,
        hasOutstandingPayments: false,
        hasRecurringPayments: false,
        isBlocked: false
      },
      '987654321098': {
        accountNumber: '987654321098',
        maskedNumber: '****-****-1098',
        accountType: 'Checking Account',
        balance: '$0.00',
        status: 'Active',
        lastActivity: '2024-01-14',
        customerName: 'Jane Smith',
        eligible: true,
        hasOutstandingPayments: false,
        hasRecurringPayments: false,
        isBlocked: false
      },
      '555666777888': {
        accountNumber: '555666777888',
        maskedNumber: '****-****-7888',
        accountType: 'Business Account',
        balance: '$0.00',
        status: 'Active',
        lastActivity: '2024-01-13',
        customerName: 'ABC Corp',
        eligible: true,
        hasOutstandingPayments: false,
        hasRecurringPayments: false,
        isBlocked: false
      },
      
      // Problem accounts - various issues
      '111222333444': {
        accountNumber: '111222333444',
        maskedNumber: '****-****-3444',
        accountType: 'Savings Account',
        balance: '$150.00',
        status: 'Active',
        lastActivity: '2024-01-16',
        customerName: 'Test User',
        eligible: false,
        hasOutstandingPayments: true,
        hasRecurringPayments: false,
        isBlocked: false,
        issues: ['Outstanding balance of $150.00']
      },
      '999888777666': {
        accountNumber: '999888777666',
        maskedNumber: '****-****-7666',
        accountType: 'Checking Account',
        balance: '$0.00',
        status: 'Active',
        lastActivity: '2024-01-16',
        customerName: 'Test User 2',
        eligible: false,
        hasOutstandingPayments: false,
        hasRecurringPayments: true,
        isBlocked: false,
        issues: ['Active recurring payments (Netflix, Spotify)']
      },
      '444555666777': {
        accountNumber: '444555666777',
        maskedNumber: '****-****-6777',
        accountType: 'Savings Account',
        balance: '$0.00',
        status: 'Blocked',
        lastActivity: '2024-01-10',
        customerName: 'Blocked User',
        eligible: false,
        hasOutstandingPayments: false,
        hasRecurringPayments: false,
        isBlocked: true,
        issues: ['Account is blocked/inactive']
      },
      '333444555666': {
        accountNumber: '333444555666',
        maskedNumber: '****-****-5666',
        accountType: 'Checking Account',
        balance: '$25.50',
        status: 'Active',
        lastActivity: '2024-01-16',
        customerName: 'Multiple Issues User',
        eligible: false,
        hasOutstandingPayments: true,
        hasRecurringPayments: true,
        isBlocked: false,
        issues: [
          'Outstanding balance of $25.50',
          'Active recurring payments (Gym membership, Insurance)'
        ]
      }
    };
    
    const account = accounts[accountNumber];
    if (!account) {
      throw new Error('Account not found or invalid');
    }
    
    return {
      success: true,
      account
    };
  },

  // Validate account number format
  validateAccountFormat: (accountNumber) => {
    const cleaned = accountNumber.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      return { valid: false, error: 'Please enter an account number.' };
    }
    
    if (cleaned.length < 12) {
      return { valid: false, error: 'Account number must be at least 12 digits.' };
    }
    
    if (cleaned.length > 16) {
      return { valid: false, error: 'Account number cannot exceed 16 digits.' };
    }
    
    if (!/^\d+$/.test(cleaned)) {
      return { valid: false, error: 'Account number should contain only digits.' };
    }
    
    return { valid: true, cleaned };
  },

  // Simulate account closure process with 6 steps
  processAccountClosure: async (accountNumber, reason) => {
    const steps = [
      { id: 1, name: 'Verifying account information', duration: 2000 },
      { id: 2, name: 'Checking outstanding payments', duration: 1500 },
      { id: 3, name: 'Validating recurring payments', duration: 1800 },
      { id: 4, name: 'Recording closure reason', duration: 1000 },
      { id: 5, name: 'Initiating closure process', duration: 2500 },
      { id: 6, name: 'Generating closure ID', duration: 1200 }
    ];

    const closureId = `CSW-${Math.floor(Math.random() * 9000) + 1000}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    return {
      success: true,
      closureId,
      steps,
      totalDuration: steps.reduce((sum, step) => sum + step.duration, 0),
      reason
    };
  }
};

// Mock closure scenarios for different timing simulations
export const mockClosureScenarios = {
  successful: {
    stepDurations: [2000, 1500, 1800, 1000, 2500, 1200]
  },
  quick: {
    stepDurations: [500, 400, 600, 300, 800, 400]
  },
  withDelay: {
    stepDurations: [3000, 2500, 3000, 1500, 4000, 2000]
  }
};

// Closure reasons options
export const closureReasons = [
  { id: 'no_longer_needed', label: 'No longer needed', value: 'no_longer_needed' },
  { id: 'high_fees', label: 'High fees', value: 'high_fees' },
  { id: 'switching_competitor', label: 'Switching to competitor', value: 'switching_competitor' },
  { id: 'other', label: 'Other', value: 'other', allowCustom: true }
];