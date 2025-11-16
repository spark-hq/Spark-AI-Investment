import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { investmentTypes, timePeriods, returnRates } from '../data/dummyData';
import { calculateSIP, calculateLumpsum, calculateStepUpSIP, generateYearlyBreakdown } from '../utils/calculations';
import { Calculator as CalcIcon, TrendingUp, RefreshCw, Sparkles, DollarSign, Clock, Percent } from 'lucide-react';

const Calculator = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    investmentType: 'sip',
    amount: '10000',
    timePeriod: '10',
    expectedReturn: '12',
    stepUpPercentage: '10'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.investmentType) {
      newErrors.investmentType = 'Please select an investment type';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.timePeriod || formData.timePeriod <= 0) {
      newErrors.timePeriod = 'Please select a time period';
    }
    
    if (!formData.expectedReturn || formData.expectedReturn <= 0) {
      newErrors.expectedReturn = 'Please select expected return';
    }
    
    if (formData.investmentType === 'stepup' && (!formData.stepUpPercentage || formData.stepUpPercentage <= 0)) {
      newErrors.stepUpPercentage = 'Please enter step-up percentage';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const amount = parseFloat(formData.amount);
    const returnRate = parseFloat(formData.expectedReturn);
    const years = parseInt(formData.timePeriod);
    const stepUp = parseFloat(formData.stepUpPercentage) || 0;

    let result;

    if (formData.investmentType === 'sip') {
      result = calculateSIP(amount, returnRate, years);
    } else if (formData.investmentType === 'lumpsum') {
      result = calculateLumpsum(amount, returnRate, years);
    } else if (formData.investmentType === 'stepup') {
      result = calculateStepUpSIP(amount, returnRate, years, stepUp);
    }

    const yearlyBreakdown = generateYearlyBreakdown(
      formData.investmentType,
      amount,
      returnRate,
      years,
      stepUp
    );

    // Store result in sessionStorage to pass to results page
    const calculationResult = {
      ...formData,
      ...result,
      yearlyBreakdown
    };
    
    sessionStorage.setItem('calculationResult', JSON.stringify(calculationResult));
    
    // Navigate to results page
    navigate('/results');
  };

  const handleReset = () => {
    setFormData({
      investmentType: 'sip',
      amount: '10000',
      timePeriod: '10',
      expectedReturn: '12',
      stepUpPercentage: '10'
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
              <CalcIcon className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Investment Calculator
            </h1>
            <Sparkles className="text-purple-600 animate-pulse" size={32} />
          </div>
          <p className="text-xl text-gray-600">
            Calculate your investment returns with AI-powered precision
          </p>
        </div>

        {/* Calculator Card */}
        <Card 
          title="Enter Investment Details" 
          subtitle="Fill in your investment parameters"
          className="mb-8 animate-fadeIn border-2 border-indigo-100 shadow-xl"
        >
          <form onSubmit={handleCalculate}>
            {/* Investment Type */}
            <div className="mb-6">
              <Select
                label="Investment Type"
                name="investmentType"
                value={formData.investmentType}
                onChange={handleChange}
                options={investmentTypes}
                required
                error={errors.investmentType}
                helperText="Choose how you want to invest"
              />
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <Input
                label={
                  formData.investmentType === 'lumpsum' 
                    ? 'Investment Amount (₹)' 
                    : 'Monthly Investment (₹)'
                }
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="10000"
                icon="₹"
                min="100"
                step="100"
                required
                error={errors.amount}
                helperText={
                  formData.investmentType === 'lumpsum'
                    ? 'Enter one-time investment amount'
                    : 'Enter monthly investment amount'
                }
              />
            </div>

            {/* Time Period */}
            <div className="mb-6">
              <Select
                label="Investment Period"
                name="timePeriod"
                value={formData.timePeriod}
                onChange={handleChange}
                options={timePeriods}
                required
                error={errors.timePeriod}
                helperText="How long do you want to invest?"
              />
            </div>

            {/* Expected Return */}
            <div className="mb-6">
              <Select
                label="Expected Annual Return (%)"
                name="expectedReturn"
                value={formData.expectedReturn}
                onChange={handleChange}
                options={returnRates}
                required
                error={errors.expectedReturn}
                helperText="Expected yearly return percentage"
              />
            </div>

            {/* Step-up Percentage (only for step-up SIP) */}
            {formData.investmentType === 'stepup' && (
              <div className="mb-6 animate-fadeIn">
                <Input
                  label="Annual Step-up (%)"
                  type="number"
                  name="stepUpPercentage"
                  value={formData.stepUpPercentage}
                  onChange={handleChange}
                  placeholder="10"
                  icon="%"
                  min="1"
                  max="100"
                  step="1"
                  required
                  error={errors.stepUpPercentage}
                  helperText="Yearly increase in SIP amount"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <Button 
                type="submit" 
                fullWidth 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center space-x-2"
              >
                <CalcIcon size={20} />
                <span>Calculate Returns</span>
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleReset}
                className="flex items-center justify-center space-x-2"
              >
                <RefreshCw size={20} />
                <span>Reset</span>
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 animate-fadeIn">
          <Card padding="md" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover-lift">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">SIP</h3>
              <p className="text-sm text-gray-600">
                Systematic Investment Plan - Invest fixed amount monthly
              </p>
            </div>
          </Card>

          <Card padding="md" className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover-lift">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Lumpsum</h3>
              <p className="text-sm text-gray-600">
                One-time bulk investment for long-term growth
              </p>
            </div>
          </Card>

          <Card padding="md" className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover-lift">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Step-up SIP</h3>
              <p className="text-sm text-gray-600">
                Increase SIP amount annually to boost returns
              </p>
            </div>
          </Card>
        </div>

        {/* Pro Tip */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 animate-fadeIn">
          <div className="flex items-start space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Pro Tip</h4>
              <p className="text-indigo-100 text-sm">
                For long-term wealth creation, consider Step-up SIP with at least 10% annual increment. 
                This helps you invest more as your income grows and significantly boosts your returns!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;