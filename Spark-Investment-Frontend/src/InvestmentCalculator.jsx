import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, DollarSign } from 'lucide-react';

  const investmentCategories = [
    { id: 'largeCap', name: 'Large Cap / Index Fund', defaultReturn: 12, color: '#3b82f6' },
    { id: 'flexiCap', name: 'Flexi Cap Fund', defaultReturn: 13, color: '#06b6d4' },
    { id: 'midCap', name: 'Mid Cap Fund', defaultReturn: 14, color: '#8b5cf6' },
    { id: 'smallCap', name: 'Small Cap Fund', defaultReturn: 16, color: '#ec4899' },
    { id: 'debt', name: 'Debt / Hybrid Fund', defaultReturn: 7, color: '#10b981' },
    { id: 'gold', name: 'Gold ETF', defaultReturn: 8, color: '#f59e0b' },
    { id: 'crypto', name: 'Crypto (BTC/ETH)', defaultReturn: 20, color: '#ef4444' },
    { id: 'fd', name: 'Fixed Deposit', defaultReturn: 6.5, color: '#14b8a6' },
    { id: 'ppf', name: 'PPF', defaultReturn: 7.1, color: '#84cc16' },
    { id: 'nps', name: 'NPS', defaultReturn: 10, color: '#f97316' },
  ];
  
const InvestmentCalculator = () => {
  const [stepupFrequency, setStepupFrequency] = useState('yearly');
  const [investmentYears, setInvestmentYears] = useState(10);

  const [selectedInvestments, setSelectedInvestments] = useState([
    { id: 'inv1', categoryId: 'largeCap', amount: 3000, expectedReturn: 12 },
    { id: 'inv2', categoryId: 'flexiCap', amount: 1000, expectedReturn: 13 },
    { id: 'inv3', categoryId: 'midCap', amount: 1500, expectedReturn: 14 },
    { id: 'inv4', categoryId: 'smallCap', amount: 1000, expectedReturn: 16 },
    { id: 'inv5', categoryId: 'debt', amount: 1000, expectedReturn: 7 },
    { id: 'inv6', categoryId: 'gold', amount: 1000, expectedReturn: 8 },
    { id: 'inv7', categoryId: 'crypto', amount: 1500, expectedReturn: 20 },
  ]);

  const addInvestment = () => {
    const newId = `inv${Date.now()}`;
    setSelectedInvestments([
      ...selectedInvestments,
      { id: newId, categoryId: 'largeCap', amount: 1000, expectedReturn: 12 }
    ]);
  };

  const removeInvestment = (id) => {
    if (selectedInvestments.length > 1) {
      setSelectedInvestments(selectedInvestments.filter(inv => inv.id !== id));
    }
  };

  const updateInvestment = (id, field, value) => {
    setSelectedInvestments(selectedInvestments.map(inv => {
      if (inv.id === id) {
        if (field === 'categoryId') {
          const category = investmentCategories.find(cat => cat.id === value);
          return { ...inv, [field]: value, expectedReturn: category.defaultReturn };
        }
        return { ...inv, [field]: value };
      }
      return inv;
    }));
  };

  const calculateSIP = (monthly, rate, years, stepupPercent, frequency) => {
    const monthlyRate = rate / 12 / 100;
    const stepupMonths = frequency === 'yearly' ? 12 : 6;
    let totalInvested = 0;
    let futureValue = 0;
    let currentSIP = monthly;
    
    for (let month = 1; month <= years * 12; month++) {
      totalInvested += currentSIP;
      futureValue = (futureValue + currentSIP) * (1 + monthlyRate);
      
      if (month % stepupMonths === 0 && month < years * 12) {
        currentSIP = currentSIP * 1.10;
      }
    }
    
    return { invested: totalInvested, value: futureValue, gains: futureValue - totalInvested };
  };

  const results = useMemo(() => {
    const categoryResults = {};
    selectedInvestments.forEach(inv => {
      const result = calculateSIP(inv.amount, inv.expectedReturn, investmentYears, 10, stepupFrequency);
      if (categoryResults[inv.categoryId]) {
        categoryResults[inv.categoryId].invested += result.invested;
        categoryResults[inv.categoryId].value += result.value;
        categoryResults[inv.categoryId].gains += result.gains;
      } else {
        categoryResults[inv.categoryId] = result;
      }
    });

    const total = Object.values(categoryResults).reduce(
      (acc, curr) => ({
        invested: acc.invested + curr.invested,
        value: acc.value + curr.value,
        gains: acc.gains + curr.gains
      }),
      { invested: 0, value: 0, gains: 0 }
    );

    return { categoryResults, total };
  }, [selectedInvestments, investmentYears, stepupFrequency]);

  const yearlyBreakdown = useMemo(() => {
    const data = [];
    for (let year = 1; year <= investmentYears; year++) {
      let yearInvested = 0;
      let yearValue = 0;
      
      selectedInvestments.forEach(inv => {
        const result = calculateSIP(inv.amount, inv.expectedReturn, year, 10, stepupFrequency);
        yearInvested += result.invested;
        yearValue += result.value;
      });
      
      data.push({ year, invested: yearInvested, value: yearValue });
    }
    return data;
  }, [selectedInvestments, investmentYears, stepupFrequency]);

  const pieData = useMemo(() => {
    return Object.entries(results.categoryResults).map(([categoryId, result]) => {
      const category = investmentCategories.find(cat => cat.id === categoryId);
      return {
        name: category.name,
        value: result.value,
        color: category.color
      };
    });
  }, [results]);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatLargeNumber = (num) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return formatCurrency(num);
  };

  const totalMonthly = selectedInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Custom Investment Calculator</h1>
        <p className="text-slate-600 mb-4">Build your personalized investment portfolio with 10% step-up</p>
        
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-sm text-slate-600">Current Monthly Investment</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalMonthly)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Investment Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Investment Duration (Years)
              </label>
              <input
                type="number"
                value={investmentYears}
                onChange={(e) => setInvestmentYears(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Step-up Frequency
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setStepupFrequency('yearly')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    stepupFrequency === 'yearly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Yearly
                </button>
                <button
                  onClick={() => setStepupFrequency('halfyearly')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    stepupFrequency === 'halfyearly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Half-Yearly
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Total Invested</span>
              <span className="text-lg font-bold text-blue-600">{formatLargeNumber(results.total.invested)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Portfolio Value</span>
              <span className="text-lg font-bold text-green-600">{formatLargeNumber(results.total.value)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Total Gains</span>
              <span className="text-lg font-bold text-purple-600">{formatLargeNumber(results.total.gains)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Return %</span>
              <span className="text-lg font-bold text-amber-600">
                {((results.total.gains / results.total.invested) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Your Investment Portfolio</h2>
            <button
              onClick={addInvestment}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {selectedInvestments.map((inv) => (
              <div key={inv.id} className="flex gap-3 items-start p-4 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition">
                <div className="flex-1 grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Investment Type</label>
                    <select
                      value={inv.categoryId}
                      onChange={(e) => updateInvestment(inv.id, 'categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {investmentCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Monthly Amount (₹)</label>
                    <input
                      type="number"
                      value={inv.amount}
                      onChange={(e) => updateInvestment(inv.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="100"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Expected Return (%)</label>
                    <input
                      type="number"
                      value={inv.expectedReturn}
                      onChange={(e) => updateInvestment(inv.id, 'expectedReturn', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                      step="0.5"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => removeInvestment(inv.id)}
                  disabled={selectedInvestments.length === 1}
                  className={`p-2 rounded-lg transition ${
                    selectedInvestments.length === 1
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title="Remove investment"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Growth Over {investmentYears} Year{investmentYears !== 1 ? 's' : ''}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={yearlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={(value) => formatLargeNumber(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="invested" stroke="#3b82f6" strokeWidth={2} name="Amount Invested" />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Portfolio Value" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Portfolio Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Detailed Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="py-3 px-4 font-semibold text-slate-700">Category</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">Monthly (Start)</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">Monthly (End)</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">Total Invested</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">Final Value</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">Gains</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results.categoryResults).map(([categoryId, result]) => {
                const category = investmentCategories.find(cat => cat.id === categoryId);
                const categoryInvestments = selectedInvestments.filter(inv => inv.categoryId === categoryId);
                const monthlyStart = categoryInvestments.reduce((sum, inv) => sum + inv.amount, 0);
                const stepupCount = stepupFrequency === 'yearly' ? (investmentYears - 1) : ((investmentYears * 2) - 1);
                const monthlyEnd = monthlyStart * Math.pow(1.1, stepupCount);
                
                return (
                  <tr key={categoryId} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{category.name}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(monthlyStart)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(monthlyEnd)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(result.invested)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      {formatCurrency(result.value)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-purple-600">
                      {formatCurrency(result.gains)}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-100 font-bold">
                <td className="py-3 px-4">TOTAL</td>
                <td className="py-3 px-4 text-right">{formatCurrency(totalMonthly)}</td>
                <td className="py-3 px-4 text-right">
                  {formatCurrency(totalMonthly * Math.pow(1.1, stepupFrequency === 'yearly' ? (investmentYears - 1) : ((investmentYears * 2) - 1)))}
                </td>
                <td className="py-3 px-4 text-right">{formatCurrency(results.total.invested)}</td>
                <td className="py-3 px-4 text-right text-green-600">
                  {formatCurrency(results.total.value)}
                </td>
                <td className="py-3 px-4 text-right text-purple-600">
                  {formatCurrency(results.total.gains)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-sm text-slate-700">
          <strong>Note:</strong> This calculator uses compound interest with 10% step-up increments. 
          Returns are assumed to be consistent year-over-year. Actual returns will vary based on market conditions. 
          Always do thorough research before investing and consider consulting a financial advisor.
        </p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;