// Mock API service for account closure
export const accountClosureApi = {
  // Simulate account verification
  verifyAccount: async (accountNumber) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock account database
    const accounts = {
      '123456789012': {
        accountNumber: '123456789012',
        maskedNumber: '****-****-9012',
        accountType: 'Savings Account',
        balance: '$0.00',
        status: 'Active',
        lastActivity: '2024-01-15',
        customerName: 'John Doe',
        eligible: true
      },
      '987654321098': {
        accountNumber: '987654321098',
        maskedNumber: '****-****-1098',
        accountType: 'Checking Account',
        balance: '$0.00',
        status: 'Active',
        lastActivity: '2024-01-14',
        customerName: 'Jane Smith',
        eligible: true
      },
      '555666777888': {
        accountNumber: '555666777888',
        maskedNumber: '****-****-7888',
        accountType: 'Business Account',
        balance: '$0.00',
        status: 'Active',
        lastActivity: '2024-01-13',
        customerName: 'ABC Corp',
        eligible: true
      },
      // Test accounts with issues
      '111222333444': {
        accountNumber: '111222333444',
        maskedNumber: '****-****-3444',
        accountType: 'Savings Account',
        balance: '$150.00',
        status: 'Active',
        lastActivity: '2024-01-16',
        customerName: 'Test User',
        eligible: false,
        issue: 'Outstanding balance'
      },
      '999888777666': {
        accountNumber: '999888777666',
        maskedNumber: '****-****-7666',
        accountType: 'Checking Account',
        balance: '$0.00',
        status: 'Pending',
        lastActivity: '2024-01-16',
        customerName: 'Test User 2',
        eligible: false,
        issue: 'Pending transactions'
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

  // Simulate account closure initiation
  initiateAccountClosure: async (accountNumber, reason) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    return {
      success: true,
      closureId: `CLS_${Date.now()}`,
      estimatedTime: '5-7 minutes',
      steps: [
        {
          id: 'verification',
          name: 'Identity Verification',
          status: 'pending',
          estimatedDuration: 2000
        },
        {
          id: 'settlement',
          name: 'Account Settlement',
          status: 'pending',
          estimatedDuration: 3000
        },
        {
          id: 'completion',
          name: 'Account Closure',
          status: 'pending',
          estimatedDuration: 2000
        }
      ],
      stepDurations: [2000, 3000, 2000], // milliseconds for each step
      reason
    };
  },

  // Simulate checking closure eligibility
  checkClosureEligibility: async (accountNumber) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      eligible: true,
      requirements: [
        { id: 'balance', name: 'Zero balance', status: 'completed' },
        { id: 'pending', name: 'No pending transactions', status: 'completed' },
        { id: 'documents', name: 'All documents submitted', status: 'completed' }
      ],
      warnings: [
        'Account closure is permanent and cannot be undone',
        'You will lose access to online banking services',
        'Any automatic payments will be cancelled'
      ]
    };
  },

  // Simulate getting closure status
  getClosureStatus: async (closureId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      closureId,
      status: 'in_progress',
      currentStep: 'verification',
      completedSteps: [],
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      lastUpdated: new Date()
    };
  }
};

// Mock data for different scenarios
export const mockClosureScenarios = {
  successful: {
    stepDurations: [2000, 3000, 2000],
    accountDetails: {
      accountNumber: '****1234',
      accountType: 'Savings Account',
      balance: '$0.00'
    }
  },
  
  withDelay: {
    stepDurations: [3000, 5000, 3000],
    accountDetails: {
      accountNumber: '****5678',
      accountType: 'Checking Account',
      balance: '$0.00'
    }
  },
  
  quick: {
    stepDurations: [1000, 1500, 1000],
    accountDetails: {
      accountNumber: '****9012',
      accountType: 'Business Account',
      balance: '$0.00'
    }
  }
};