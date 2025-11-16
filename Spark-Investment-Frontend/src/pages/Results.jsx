import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { TrendingUp, Download, Calculator, AlertTriangle, DollarSign, Sparkles, Clock } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Get calculation result from sessionStorage
    const savedResult = sessionStorage.getItem('calculationResult');
    
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    } else {
      // If no result found, redirect to calculator
      navigate('/calculator');
    }
  }, [navigate]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  // Prepare data for pie chart
  const pieData = [
    { name: 'Total Investment', value: result.totalInvestment, color: '#6366f1' },
    { name: 'Estimated Returns', value: result.estimatedReturns, color: '#10b981' }
  ];

  // Get investment type label
  const getInvestmentTypeLabel = (type) => {
    const labels = {
      sip: 'SIP (Systematic Investment Plan)',
      lumpsum: 'Lumpsum Investment',
      stepup: 'Step-up SIP'
    };
    return labels[type] || type;
  };

  const handleRecalculate = () => {
    navigate('/calculator');
  };

  const handleDownloadReport = () => {
    alert('Download feature will be implemented with backend!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-2xl">
              <TrendingUp className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Investment Results
            </h1>
            <Sparkles className="text-green-600 animate-pulse" size={32} />
          </div>
          <p className="text-xl text-gray-600">
            Here's your AI-powered investment projection
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl hover-lift border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10 text-center">
              <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign size={24} />
              </div>
              <p className="text-indigo-100 mb-2 font-medium">Total Investment</p>
              <h3 className="text-3xl font-bold mb-2">
                {formatCurrency(result.totalInvestment)}
              </h3>
              <p className="text-sm text-indigo-100">
                {result.investmentType === 'lumpsum' 
                  ? 'One-time investment'
                  : `₹${formatNumber(result.amount)}/month × ${result.timePeriod} years`
                }
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl hover-lift border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10 text-center">
              <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={24} />
              </div>
              <p className="text-green-100 mb-2 font-medium">Estimated Returns</p>
              <h3 className="text-3xl font-bold mb-2">
                {formatCurrency(result.estimatedReturns)}
              </h3>
              <p className="text-sm text-green-100">
                @ {result.expectedReturn}% annual return
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl hover-lift border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-10 text-center">
              <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} />
              </div>
              <p className="text-purple-100 mb-2 font-medium">Total Value</p>
              <h3 className="text-3xl font-bold mb-2">
                {formatCurrency(result.totalValue)}
              </h3>
              <p className="text-sm text-purple-100 flex items-center justify-center space-x-1">
                <Clock size={14} />
                <span>After {result.timePeriod} years</span>
              </p>
            </div>
          </Card>
        </div>

        {/* Investment Details */}
        <Card title="Investment Details" subtitle="Your investment parameters" className="mb-8 animate-fadeIn border-2 border-indigo-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b-2 border-gray-100">
                  <span className="text-gray-600 font-medium">Investment Type:</span>
                  <span className="font-bold text-gray-900">
                    {getInvestmentTypeLabel(result.investmentType)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b-2 border-gray-100">
                  <span className="text-gray-600 font-medium">
                    {result.investmentType === 'lumpsum' ? 'Investment Amount:' : 'Monthly Investment:'}
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(result.amount)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b-2 border-gray-100">
                  <span className="text-gray-600 font-medium">Time Period:</span>
                  <span className="font-bold text-gray-900">
                    {result.timePeriod} Years
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b-2 border-gray-100">
                  <span className="text-gray-600 font-medium">Expected Return:</span>
                  <span className="font-bold text-gray-900">
                    {result.expectedReturn}% per annum
                  </span>
                </div>
                {result.investmentType === 'stepup' && (
                  <div className="flex justify-between py-3 border-b-2 border-gray-100">
                    <span className="text-gray-600 font-medium">Annual Step-up:</span>
                    <span className="font-bold text-gray-900">
                      {result.stepUpPercentage}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-b-2 border-gray-100">
                  <span className="text-gray-600 font-medium">Wealth Gain:</span>
                  <span className="font-bold text-green-600 flex items-center space-x-1">
                    <TrendingUp size={16} />
                    <span>{((result.estimatedReturns / result.totalInvestment) * 100).toFixed(2)}%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <Card title="Investment Breakdown" subtitle="Distribution analysis" className="h-full animate-fadeIn border-2 border-purple-100 hover-lift">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                  <span className="text-gray-700 font-medium">Total Investment</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(result.totalInvestment)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span className="text-gray-700 font-medium">Estimated Returns</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(result.estimatedReturns)}</span>
              </div>
            </div>
          </Card>

          {/* Line Chart */}
          <Card title="Growth Over Time" subtitle="Cumulative growth projection" className="h-full animate-fadeIn border-2 border-green-100 hover-lift">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={result.yearlyBreakdown}>
                <defs>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="invested" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  name="Invested Amount"
                  dot={{ r: 4, fill: '#6366f1' }}
                  fill="url(#colorInvested)"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Total Value"
                  dot={{ r: 4, fill: '#10b981' }}
                  fill="url(#colorTotal)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bar Chart - Yearly Breakdown */}
        <Card title="Year-wise Analysis" subtitle="Annual investment and returns" className="mb-8 animate-fadeIn border-2 border-blue-100">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={result.yearlyBreakdown}>
              <defs>
                <linearGradient id="colorInvestedBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="colorReturnsBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="invested" fill="url(#colorInvestedBar)" name="Invested Amount" radius={[8, 8, 0, 0]} />
              <Bar dataKey="returns" fill="url(#colorReturnsBar)" name="Returns" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Detailed Breakdown Table */}
        <Card title="Detailed Year-wise Breakdown" subtitle="Complete investment timeline" className="mb-8 animate-fadeIn border-2 border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Invested Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Returns
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Total Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.yearlyBreakdown.map((row, index) => (
                  <tr key={row.year} className={`hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      Year {row.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {formatCurrency(row.invested)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {formatCurrency(row.returns)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                      {formatCurrency(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fadeIn">
          <Button 
            size="lg" 
            onClick={handleRecalculate}
            variant="outline"
            className="hover-lift flex items-center space-x-2"
          >
            <Calculator size={20} />
            <span>← Recalculate</span>
          </Button>
          <Button 
            size="lg" 
            onClick={handleDownloadReport}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover-lift flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Download Report</span>
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 animate-fadeIn">
          <div className="flex items-start space-x-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Disclaimer</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                These calculations are for illustrative purposes only and do not represent actual returns. 
                Actual investment returns may vary based on market conditions, fund performance, and other factors. 
                Please consult with a financial advisor before making investment decisions. Past performance 
                does not guarantee future results.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Results;