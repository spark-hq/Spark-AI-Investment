// src/pages/AIAnalysis.jsx

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, ArrowLeft, RefreshCw, Download } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RiskMeter from '../components/ai-analysis/RiskMeter';
import ProConsList from '../components/ai-analysis/ProConsList';
import PredictionChart from '../components/ai-analysis/PredictionChart';
import AnalysisCard from '../components/ai-analysis/AnalysisCard';
import HealthScore from '../components/ai-analysis/HealthScore';
import AIExplanation from '../components/ai-analysis/AIExplanation';
import ValuationBadge from '../components/ai-analysis/ValuationBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../components/ui/ErrorBoundary';
import { useInvestmentAnalysis } from '../hooks/useAI';
import { useInvestments } from '../hooks/useInvestments';

const AIAnalysis = () => {
  const navigate = useNavigate();
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);

  // Fetch user's investments for the selector
  const { data: investments = [], isLoading: investmentsLoading } = useInvestments();

  // Fetch AI analysis data for selected investment
  const {
    data: investmentAnalysis,
    isLoading: aiLoading,
    isError: aiError,
    refetch
  } = useInvestmentAnalysis(selectedInvestmentId);

  // Set first investment as default when investments load
  useEffect(() => {
    if (!selectedInvestmentId && investments.length > 0) {
      setSelectedInvestmentId(investments[0].id);
    }
  }, [investments, selectedInvestmentId]);

  // Get currently selected investment
  const selectedInvestment = investments.find(inv => inv.id === selectedInvestmentId);

  // Debug logging
  useEffect(() => {
    console.log('🔄 Selected Investment ID:', selectedInvestmentId);
    console.log('📊 Selected Investment:', selectedInvestment);
    console.log('🤖 Investment Analysis Data:', investmentAnalysis);
  }, [selectedInvestmentId, selectedInvestment, investmentAnalysis]);

  // Combine loading states
  const isLoading = investmentsLoading || aiLoading;

  // Create currentAnalysis object from investment-specific AI data (MUST be before any returns)
  const currentAnalysis = useMemo(() => {
    console.log('🔄 Recalculating currentAnalysis for:', selectedInvestment?.name);
    console.log('📊 Using investment analysis:', investmentAnalysis);

    // Return null if no analysis data available yet
    if (!investmentAnalysis) return null;

    // Use the per-investment analysis data directly from the API
    return {
      analysisDate: investmentAnalysis.analysisDate || new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      // Risk metrics from per-investment analysis
      riskLevel: investmentAnalysis.riskLevel || 'MEDIUM',
      riskScore: investmentAnalysis.riskScore || 55,
      volatility: investmentAnalysis.volatility || 'Moderate',
      // Health metrics from per-investment analysis
      healthScore: investmentAnalysis.healthScore || 75,
      healthGrade: investmentAnalysis.healthGrade || 'B+',
      // Valuation from per-investment analysis
      valuation: investmentAnalysis.valuation || 'Fair Value',
      valuationScore: investmentAnalysis.valuationScore || 7.5,
      // Recommendation from per-investment analysis
      recommendation: investmentAnalysis.recommendation || 'HOLD',
      confidence: investmentAnalysis.confidence || 75,
      targetPrice: investmentAnalysis.targetPrice || selectedInvestment?.currentPrice * 1.15 || 0,
      stopLoss: investmentAnalysis.stopLoss || selectedInvestment?.currentPrice * 0.92 || 0,
      // Pros and cons from per-investment analysis
      pros: investmentAnalysis.pros || [],
      cons: investmentAnalysis.cons || [],
      // AI explanation from per-investment analysis
      explanation: investmentAnalysis.aiExplanation || 'AI analysis is being processed...',
      // Sector analysis from per-investment analysis
      sectorAnalysis: investmentAnalysis.sectorAnalysis || {
        sector: selectedInvestment?.sector || 'Diversified',
        sectorGrowth: 'Positive',
        marketShare: 'Leading',
        competitivePosition: 'Strong',
        insights: `Analysis for ${selectedInvestment?.name || 'this investment'} is being generated.`
      },
      // Benchmarks from per-investment analysis
      benchmarks: investmentAnalysis.benchmarks || {
        nifty50: {
          name: 'NIFTY 50',
          performance: 'N/A',
          comparison: 'Calculating',
          differential: 'N/A'
        },
        sensex: {
          name: 'SENSEX',
          performance: 'N/A',
          comparison: 'Calculating',
          differential: 'N/A'
        }
      },
      // Diversification from per-investment analysis
      diversificationScore: investmentAnalysis.diversificationScore || 7.0,
      diversificationInsight: investmentAnalysis.diversificationInsight || 'Diversification analysis is being calculated.',
      // AI insights from per-investment analysis
      aiInsights: investmentAnalysis.aiInsights || [
        'AI is analyzing this investment...',
        'Detailed insights will be available shortly.',
        'Please wait while we process market data.'
      ],
      // Historical data and predictions from per-investment analysis
      historicalData: investmentAnalysis.historicalData || [],
      predictions: investmentAnalysis.predictions || [],
      investmentName: selectedInvestment?.name || investmentAnalysis.investmentName || 'Investment'
    };
  }, [investmentAnalysis, selectedInvestment]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle investment change
  const handleInvestmentChange = (e) => {
    setSelectedInvestmentId(e.target.value);
  };

  // Handle refresh analysis
  const handleRefresh = () => {
    refetch(); // Refetch all AI data
  };

  // Handle download report
  const handleDownload = () => {
    alert('Download feature will be implemented with backend!');
  };

  // Show loading spinner while fetching data
  if (investmentsLoading) {
    return <LoadingSpinner fullScreen message="Loading your investments..." />;
  }

  // Show error if AI data fetch fails
  if (aiError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 flex items-center justify-center">
        <div className="max-w-md">
          <ErrorDisplay error={aiError} retry={refetch} />
        </div>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <LoadingSpinner message="Generating AI analysis..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium mb-4 flex items-center space-x-2 transition-colors px-4 py-3 rounded-lg min-h-[44px]"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Brain className="text-white" size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              AI Investment Analysis
            </h1>
            <Sparkles className="text-purple-600 animate-pulse" size={32} />
          </div>
          <p className="text-xl text-gray-600 text-center">
            Deep insights powered by advanced AI algorithms
          </p>
        </div>

        {/* Investment Selector Card */}
        <Card className="mb-8 animate-fadeIn border-2 border-indigo-100 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1 w-full">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                <Brain className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Investment for Analysis
                </label>
                <select
                  value={selectedInvestmentId || ''}
                  onChange={handleInvestmentChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer text-base font-medium"
                  disabled={aiLoading}
                >
                  {investments.length === 0 ? (
                    <option value="">No investments available</option>
                  ) : (
                    investments.map((investment) => (
                      <option key={investment.id} value={investment.id}>
                        {investment.name} ({investment.symbol}) - ₹{investment.currentPrice}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="hover-lift flex items-center space-x-2"
                disabled={aiLoading}
              >
                <RefreshCw size={18} className={aiLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover-lift flex items-center space-x-2"
                disabled={aiLoading}
              >
                <Download size={18} />
                <span>Download Report</span>
              </Button>
            </div>
          </div>

          {/* Analysis Date */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Analysis generated on: <span className="font-semibold text-gray-900">{currentAnalysis.analysisDate}</span>
            </p>
          </div>
        </Card>

        {/* Loading State */}
        {aiLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl mb-6 animate-pulse">
              <Brain className="text-white" size={64} />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analyzing Investment...</h3>
            <p className="text-gray-600">AI is processing market data and generating insights</p>
            <div className="mt-6 flex space-x-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          <>
            {/* Three Column Layout - Risk, Health, Valuation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
              <RiskMeter
                riskLevel={currentAnalysis.riskLevel}
                riskScore={currentAnalysis.riskScore}
                volatility={currentAnalysis.volatility}
              />
              <HealthScore
                healthScore={currentAnalysis.healthScore}
                healthGrade={currentAnalysis.healthGrade}
              />
              <ValuationBadge
                valuation={currentAnalysis.valuation}
                valuationScore={currentAnalysis.valuationScore}
              />
            </div>

            {/* Analysis Card - Full Width */}
            <div className="mb-8 animate-fadeIn">
              <AnalysisCard
                analysis={currentAnalysis}
                formatCurrency={formatCurrency}
              />
            </div>

            {/* AI Explanation - Full Width */}
            <div className="mb-8 animate-fadeIn">
              <AIExplanation
                explanation={currentAnalysis.explanation}
                recommendation={currentAnalysis.recommendation}
              />
            </div>

            {/* Pros and Cons */}
            <div className="mb-8 animate-fadeIn">
              <ProConsList
                pros={currentAnalysis.pros}
                cons={currentAnalysis.cons}
              />
            </div>

            {/* Prediction Chart */}
            <div className="mb-8 animate-fadeIn">
              <PredictionChart
                historicalData={currentAnalysis.historicalData}
                predictions={currentAnalysis.predictions}
                investmentName={currentAnalysis.investmentName}
                formatCurrency={formatCurrency}
              />
            </div>

            {/* AI Disclaimer */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 animate-fadeIn">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0">
                  <Sparkles className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">AI Analysis Disclaimer</h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    This AI-powered analysis is generated using advanced machine learning algorithms, historical market data, 
                    and current market trends. The insights, predictions, and recommendations provided are for informational 
                    purposes only and should not be considered as financial advice.
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Past performance does not guarantee future results</li>
                    <li>Market conditions can change rapidly and unpredictably</li>
                    <li>AI predictions have varying confidence levels</li>
                    <li>Always conduct your own research before investing</li>
                    <li>Consult a certified financial advisor for personalized advice</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* CTA - Back to Dashboard */}
            <Card className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 animate-fadeIn hover-lift shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-white opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                    <Brain className="text-white" size={48} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Ready to Take Action?</h3>
                    <p className="text-indigo-100">
                      View your complete portfolio or start live trading with AI assistance
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => navigate('/investments')}
                    className="bg-white text-indigo-600 hover:bg-gray-100 hover-lift"
                  >
                    View Portfolio →
                  </Button>
                  <Button
                    onClick={() => navigate('/live-trading')}
                    className="bg-green-600 hover:bg-green-700 hover-lift"
                  >
                    Start Trading →
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;