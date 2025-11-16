// Dummy calculation data for development
export const investmentTypes = [
  { value: 'sip', label: 'SIP (Systematic Investment Plan)' },
  { value: 'lumpsum', label: 'Lumpsum Investment' },
  { value: 'stepup', label: 'Step-up SIP' }
];

export const timePeriods = [
  { value: '1', label: '1 Year' },
  { value: '2', label: '2 Years' },
  { value: '3', label: '3 Years' },
  { value: '5', label: '5 Years' },
  { value: '10', label: '10 Years' },
  { value: '15', label: '15 Years' },
  { value: '20', label: '20 Years' },
  { value: '25', label: '25 Years' },
  { value: '30', label: '30 Years' }
];

export const returnRates = [
  { value: '8', label: '8% (Conservative)' },
  { value: '10', label: '10% (Moderate)' },
  { value: '12', label: '12% (Balanced)' },
  { value: '15', label: '15% (Aggressive)' },
  { value: '18', label: '18% (Very Aggressive)' }
];

// Sample calculation result
export const sampleCalculationResult = {
  investmentType: 'SIP',
  monthlyInvestment: 10000,
  timePeriod: 10,
  expectedReturn: 12,
  totalInvestment: 1200000,
  estimatedReturns: 1320542,
  totalValue: 2320542,
  yearlyBreakdown: [
    { year: 1, invested: 120000, returns: 7920, total: 127920 },
    { year: 2, invested: 240000, returns: 24156, total: 264156 },
    { year: 3, invested: 360000, returns: 49344, total: 409344 },
    { year: 4, invested: 480000, returns: 84996, total: 564996 },
    { year: 5, invested: 600000, returns: 132732, total: 732732 },
    { year: 6, invested: 720000, returns: 194340, total: 914340 },
    { year: 7, invested: 840000,Rows: 271824, total: 1111824 },
    { year: 8, invested: 960000, returns: 367428, total: 1327428 },
    { year: 9, invested: 1080000, returns: 483684, total: 1563684 },
    { year: 10, invested: 1200000, returns: 623916, total: 1823916 }
  ]
};