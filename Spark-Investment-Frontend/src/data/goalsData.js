// Mock data for Financial Goals
export const goalCategories = [
  { id: 'retirement', name: 'Retirement', icon: '🏖️', color: 'blue' },
  { id: 'house', name: 'House Purchase', icon: '🏠', color: 'green' },
  { id: 'education', name: 'Education Fund', icon: '🎓', color: 'purple' },
  { id: 'wedding', name: 'Wedding', icon: '💍', color: 'pink' },
  { id: 'emergency', name: 'Emergency Fund', icon: '🛡️', color: 'orange' },
  { id: 'custom', name: 'Custom Goal', icon: '🎯', color: 'indigo' },
];

export const mockGoals = [
  {
    id: 1,
    name: 'Retirement Fund',
    category: 'retirement',
    targetAmount: 20000000, // ₹2 Crore
    currentAmount: 4500000, // ₹45 Lakhs
    targetDate: '2045-12-31',
    startDate: '2020-01-01',
    monthlyContribution: 25000,
    priority: 'high',
    status: 'active',
    description: 'Build a comfortable retirement corpus for financial independence',
    riskProfile: 'moderate',
    expectedReturns: 12, // 12% annual returns
    investmentMix: {
      equity: 60,
      debt: 30,
      gold: 10,
    },
    linkedInvestments: ['SBI Bluechip Fund', 'ICICI Prudential Equity Fund'],
  },
  {
    id: 2,
    name: 'Dream Home',
    category: 'house',
    targetAmount: 8000000, // ₹80 Lakhs
    currentAmount: 2400000, // ₹24 Lakhs
    targetDate: '2028-06-30',
    startDate: '2021-01-01',
    monthlyContribution: 50000,
    priority: 'high',
    status: 'active',
    description: '3 BHK apartment in Mumbai suburbs',
    riskProfile: 'moderate',
    expectedReturns: 10,
    investmentMix: {
      equity: 40,
      debt: 50,
      gold: 10,
    },
    linkedInvestments: ['Axis Bluechip Fund', 'HDFC Balanced Advantage Fund'],
  },
  {
    id: 3,
    name: "Child's Education",
    category: 'education',
    targetAmount: 5000000, // ₹50 Lakhs
    currentAmount: 1200000, // ₹12 Lakhs
    targetDate: '2030-04-01',
    startDate: '2020-06-01',
    monthlyContribution: 30000,
    priority: 'high',
    status: 'active',
    description: 'Engineering degree from top college (IIT/NIT)',
    riskProfile: 'moderate',
    expectedReturns: 11,
    investmentMix: {
      equity: 50,
      debt: 40,
      gold: 10,
    },
    linkedInvestments: ["SBI Children's Benefit Fund", 'ICICI Prudential Child Care Fund'],
  },
  {
    id: 4,
    name: 'Emergency Fund',
    category: 'emergency',
    targetAmount: 600000, // ₹6 Lakhs (6 months expenses)
    currentAmount: 550000, // ₹5.5 Lakhs
    targetDate: '2025-12-31',
    startDate: '2023-01-01',
    monthlyContribution: 10000,
    priority: 'critical',
    status: 'active',
    description: '6 months of living expenses for financial security',
    riskProfile: 'low',
    expectedReturns: 6,
    investmentMix: {
      equity: 0,
      debt: 80,
      liquid: 20,
    },
    linkedInvestments: ['Liquid Fund', 'Ultra Short Duration Fund'],
  },
  {
    id: 5,
    name: 'Wedding Fund',
    category: 'wedding',
    targetAmount: 1500000, // ₹15 Lakhs
    currentAmount: 650000, // ₹6.5 Lakhs
    targetDate: '2027-11-30',
    startDate: '2022-01-01',
    monthlyContribution: 20000,
    priority: 'medium',
    status: 'active',
    description: 'Dream wedding celebration with family and friends',
    riskProfile: 'moderate',
    expectedReturns: 9,
    investmentMix: {
      equity: 30,
      debt: 60,
      gold: 10,
    },
    linkedInvestments: ['Hybrid Fund', 'Short Duration Debt Fund'],
  },
  {
    id: 6,
    name: 'World Tour',
    category: 'custom',
    targetAmount: 1000000, // ₹10 Lakhs
    currentAmount: 300000, // ₹3 Lakhs
    targetDate: '2026-12-31',
    startDate: '2023-01-01',
    monthlyContribution: 15000,
    priority: 'low',
    status: 'active',
    description: 'Travel across Europe and Asia for 3 months',
    riskProfile: 'moderate',
    expectedReturns: 10,
    investmentMix: {
      equity: 40,
      debt: 50,
      gold: 10,
    },
    linkedInvestments: ['Balanced Advantage Fund'],
  },
  {
    id: 7,
    name: 'Car Purchase',
    category: 'custom',
    targetAmount: 1500000, // ₹15 Lakhs
    currentAmount: 1500000, // ₹15 Lakhs - Achieved!
    targetDate: '2024-06-30',
    startDate: '2021-01-01',
    monthlyContribution: 0, // Stopped after achievement
    priority: 'medium',
    status: 'achieved',
    description: 'Mid-size SUV for family',
    riskProfile: 'moderate',
    expectedReturns: 10,
    investmentMix: {
      equity: 30,
      debt: 60,
      gold: 10,
    },
    linkedInvestments: [],
    achievedDate: '2024-06-15',
  },
  {
    id: 8,
    name: 'Business Startup Capital',
    category: 'custom',
    targetAmount: 3000000, // ₹30 Lakhs
    currentAmount: 800000, // ₹8 Lakhs
    targetDate: '2029-03-31',
    startDate: '2023-06-01',
    monthlyContribution: 35000,
    priority: 'medium',
    status: 'active',
    description: 'Seed capital for tech startup venture',
    riskProfile: 'high',
    expectedReturns: 14,
    investmentMix: {
      equity: 70,
      debt: 20,
      gold: 10,
    },
    linkedInvestments: ['Small Cap Fund', 'Mid Cap Fund'],
  },
];

// Helper function to calculate goal progress
export const calculateGoalProgress = (goal) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  return Math.min(Math.round(progress), 100);
};

// Helper function to calculate remaining amount
export const calculateRemainingAmount = (goal) => {
  return Math.max(goal.targetAmount - goal.currentAmount, 0);
};

// Helper function to calculate months remaining
export const calculateMonthsRemaining = (targetDateString) => {
  const targetDate = new Date(targetDateString);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  return Math.max(diffMonths, 0);
};

// Helper function to calculate required monthly SIP
export const calculateRequiredSIP = (goal) => {
  const remainingAmount = calculateRemainingAmount(goal);
  const monthsRemaining = calculateMonthsRemaining(goal.targetDate);

  if (monthsRemaining === 0) return 0;

  const monthlyRate = goal.expectedReturns / 12 / 100;

  // FV = P × [(1 + r)^n - 1] / r × (1 + r)
  // Solving for P (monthly SIP)
  const requiredSIP = remainingAmount / (((Math.pow(1 + monthlyRate, monthsRemaining) - 1) / monthlyRate) * (1 + monthlyRate));

  return Math.round(requiredSIP);
};

// Helper function to calculate projected final amount
export const calculateProjectedAmount = (goal) => {
  const monthsRemaining = calculateMonthsRemaining(goal.targetDate);
  const monthlyRate = goal.expectedReturns / 12 / 100;

  // Current amount will grow
  const futureValueOfCurrent = goal.currentAmount * Math.pow(1 + monthlyRate, monthsRemaining);

  // Future value of monthly SIPs
  const futureValueOfSIP = goal.monthlyContribution *
    (((Math.pow(1 + monthlyRate, monthsRemaining) - 1) / monthlyRate) * (1 + monthlyRate));

  return Math.round(futureValueOfCurrent + futureValueOfSIP);
};

// Helper function to get goal category details
export const getGoalCategory = (categoryId) => {
  return goalCategories.find((cat) => cat.id === categoryId) || goalCategories[goalCategories.length - 1];
};

// Helper function to get goal status color
export const getGoalStatusColor = (status) => {
  const colors = {
    active: 'blue',
    paused: 'yellow',
    achieved: 'green',
    delayed: 'red',
  };
  return colors[status] || 'gray';
};

// Helper function to get priority color
export const getPriorityColor = (priority) => {
  const colors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'green',
  };
  return colors[priority] || 'gray';
};

// Summary statistics
export const getGoalsSummary = (goals) => {
  const activeGoals = goals.filter((g) => g.status === 'active');
  const achievedGoals = goals.filter((g) => g.status === 'achieved');

  const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalMonthlyContribution = activeGoals.reduce((sum, g) => sum + g.monthlyContribution, 0);

  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return {
    totalGoals: goals.length,
    activeGoals: activeGoals.length,
    achievedGoals: achievedGoals.length,
    totalTargetAmount,
    totalCurrentAmount,
    totalMonthlyContribution,
    overallProgress: Math.round(overallProgress),
    remainingAmount: totalTargetAmount - totalCurrentAmount,
  };
};

export default mockGoals;
