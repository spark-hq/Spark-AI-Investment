// SIP Calculator
export const calculateSIP = (monthlyInvestment, rateOfReturn, timePeriod) => {
  const monthlyRate = rateOfReturn / 12 / 100;
  const months = timePeriod * 12;
  
  // Future Value of SIP formula: P × ((1 + r)^n - 1) / r) × (1 + r)
  const futureValue = monthlyInvestment * 
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  
  const totalInvestment = monthlyInvestment * months;
  const estimatedReturns = futureValue - totalInvestment;
  
  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(futureValue)
  };
};

// Lumpsum Calculator
export const calculateLumpsum = (investmentAmount, rateOfReturn, timePeriod) => {
  // Future Value = P × (1 + r)^n
  const futureValue = investmentAmount * Math.pow(1 + rateOfReturn / 100, timePeriod);
  
  const totalInvestment = investmentAmount;
  const estimatedReturns = futureValue - totalInvestment;
  
  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(futureValue)
  };
};

// Step-up SIP Calculator
export const calculateStepUpSIP = (monthlyInvestment, rateOfReturn, timePeriod, stepUpPercentage) => {
  const monthlyRate = rateOfReturn / 12 / 100;
  const months = timePeriod * 12;
  let totalInvestment = 0;
  let futureValue = 0;
  let currentMonthlyInvestment = monthlyInvestment;
  
  for (let month = 1; month <= months; month++) {
    // Increase investment at the start of each year
    if (month > 1 && (month - 1) % 12 === 0) {
      currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpPercentage / 100);
    }
    
    totalInvestment += currentMonthlyInvestment;
    
    // Calculate future value for this contribution
    const remainingMonths = months - month + 1;
    futureValue += currentMonthlyInvestment * Math.pow(1 + monthlyRate, remainingMonths);
  }
  
  const estimatedReturns = futureValue - totalInvestment;
  
  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(futureValue)
  };
};

// Generate yearly breakdown for charts
export const generateYearlyBreakdown = (investmentType, monthlyInvestment, rateOfReturn, timePeriod, stepUpPercentage = 0) => {
  const breakdown = [];
  
  for (let year = 1; year <= timePeriod; year++) {
    let result;
    
    if (investmentType === 'sip') {
      result = calculateSIP(monthlyInvestment, rateOfReturn, year);
    } else if (investmentType === 'lumpsum') {
      const lumpsumAmount = monthlyInvestment * 12; // Convert monthly to yearly for comparison
      result = calculateLumpsum(lumpsumAmount, rateOfReturn, year);
    } else if (investmentType === 'stepup') {
      result = calculateStepUpSIP(monthlyInvestment, rateOfReturn, year, stepUpPercentage);
    }
    
    breakdown.push({
      year,
      invested: result.totalInvestment,
      returns: result.estimatedReturns,
      total: result.totalValue
    });
  }
  
  return breakdown;
};

// Format currency in Indian format
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with commas
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};