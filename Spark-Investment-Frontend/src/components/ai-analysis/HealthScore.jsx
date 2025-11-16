// src/components/ai-analysis/HealthScore.jsx

import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

const HealthScore = ({ healthScore, healthGrade }) => {
  // Get color based on score
  const getScoreColor = () => {
    if (healthScore >= 80) {
      return {
        bg: 'from-green-500 to-emerald-500',
        text: 'text-green-600',
        lightBg: 'bg-green-50',
        border: 'border-green-200',
        ring: 'ring-green-500',
      };
    } else if (healthScore >= 60) {
      return {
        bg: 'from-blue-500 to-indigo-500',
        text: 'text-blue-600',
        lightBg: 'bg-blue-50',
        border: 'border-blue-200',
        ring: 'ring-blue-500',
      };
    } else if (healthScore >= 40) {
      return {
        bg: 'from-yellow-500 to-orange-500',
        text: 'text-yellow-600',
        lightBg: 'bg-yellow-50',
        border: 'border-yellow-200',
        ring: 'ring-yellow-500',
      };
    } else {
      return {
        bg: 'from-red-500 to-pink-500',
        text: 'text-red-600',
        lightBg: 'bg-red-50',
        border: 'border-red-200',
        ring: 'ring-red-500',
      };
    }
  };

  const colors = getScoreColor();
  const percentage = healthScore;

  return (
    <div className={`${colors.lightBg} rounded-xl p-6 border-2 ${colors.border} hover-lift`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Investment Health</h3>
        <div className={`bg-gradient-to-r ${colors.bg} p-2 rounded-lg`}>
          <Activity className="text-white" size={20} />
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          {/* Background Circle */}
          <svg className="transform -rotate-90" width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={colors.text} stopOpacity="1" />
                <stop offset="100%" className={colors.text} stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold ${colors.text}`}>{healthScore}</div>
            <div className="text-sm text-gray-600 mt-1">out of 100</div>
          </div>
        </div>
      </div>

      {/* Grade Badge */}
      <div className="flex items-center justify-center mb-4">
        <div className={`bg-gradient-to-r ${colors.bg} text-white px-6 py-3 rounded-full shadow-lg`}>
          <div className="text-center">
            <div className="text-xs opacity-90 mb-1">GRADE</div>
            <div className="text-3xl font-bold">{healthGrade}</div>
          </div>
        </div>
      </div>

      {/* Health Status */}
      <div className={`bg-white rounded-lg p-4 border ${colors.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Health Status</p>
            <p className={`font-bold ${colors.text} text-lg`}>
              {healthScore >= 80 ? 'Excellent' : 
               healthScore >= 60 ? 'Good' : 
               healthScore >= 40 ? 'Fair' : 'Poor'}
            </p>
          </div>
          <TrendingUp className={colors.text} size={24} />
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 leading-relaxed">
          {healthScore >= 80 ? 'Strong fundamentals with minimal concerns' : 
           healthScore >= 60 ? 'Healthy investment with manageable risks' : 
           healthScore >= 40 ? 'Moderate concerns, requires monitoring' : 
           'Significant concerns, high caution advised'}
        </p>
      </div>
    </div>
  );
};

export default HealthScore;