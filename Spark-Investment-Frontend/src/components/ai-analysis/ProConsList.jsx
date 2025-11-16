// src/components/ai-analysis/ProConsList.jsx

import React from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle } from 'lucide-react';

const ProConsList = ({ pros, cons }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Pros Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
            <ThumbsUp className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pros</h3>
            <p className="text-sm text-gray-600">Positive factors</p>
          </div>
        </div>

        {/* Pros List */}
        <div className="space-y-3">
          {pros.map((pro, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{pro}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-sm font-semibold text-green-700 text-center">
            {pros.length} Positive Factors Identified
          </p>
        </div>
      </div>

      {/* Cons Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-xl">
            <ThumbsDown className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Cons</h3>
            <p className="text-sm text-gray-600">Risk factors</p>
          </div>
        </div>

        {/* Cons List */}
        <div className="space-y-3">
          {cons.map((con, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 mt-0.5">
                <XCircle className="text-red-600" size={20} />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{con}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-red-200">
          <p className="text-sm font-semibold text-red-700 text-center">
            {cons.length} Risk Factors to Consider
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProConsList;