// src/components/auto-invest/RuleBuilder.jsx

import { Settings, Plus, Trash2, Save } from 'lucide-react';

const RuleBuilder = ({ selectedPlan }) => {
  if (!selectedPlan) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100 text-center">
        <div className="text-6xl mb-4">™</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">No plan selected</p>
        <p className="text-sm text-gray-500">Select a plan to customize investment rules</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="text-indigo-600" size={24} />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Investment Rules</h3>
            <p className="text-sm text-gray-600">Customize auto-invest rules for {selectedPlan.name}</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
          <Plus size={16} />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Current Rules */}
      <div className="space-y-3 mb-6">
        {selectedPlan.rules.map((rule, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="bg-indigo-100 text-indigo-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {idx + 1}
              </div>
              <p className="text-sm text-gray-800 font-medium">{rule}</p>
            </div>
            <button className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Rule Templates */}
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Quick Rule Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'Buy on market dip (5% correction)',
            'Sell at 15% profit',
            'Stop loss at 10%',
            'Rebalance quarterly',
            'Dollar-cost averaging',
            'Momentum trading',
          ].map((template, idx) => (
            <button
              key={idx}
              className="text-left p-2 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs text-gray-700 hover:text-indigo-700 transition-all"
            >
              + {template}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Rule Builder Form */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Create Custom Rule</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm">
              <option>When...</option>
              <option>Price drops</option>
              <option>Price rises</option>
              <option>Market opens</option>
              <option>Every month</option>
              <option>Profit reaches</option>
            </select>
            <input
              type="number"
              placeholder="Value (%)"
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>
          <select className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm">
            <option>Then...</option>
            <option>Buy ¹X amount</option>
            <option>Sell Y% of holdings</option>
            <option>Rebalance portfolio</option>
            <option>Send notification</option>
          </select>
          <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all">
            <Save size={16} />
            <span>Save Custom Rule</span>
          </button>
        </div>
      </div>

      {/* Save All Button */}
      <div className="mt-6 flex items-center space-x-3">
        <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg">
          Apply Changes
        </button>
        <button className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold transition-all">
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default RuleBuilder;
