// Legal Disclaimer Component
// Can be used in short or full version

function Disclaimer({ fullVersion = false }) {
  if (fullVersion) {
    return (
      <div className="disclaimer bg-yellow-50 border-l-4 border-yellow-400 p-6 my-4 rounded-lg">
        <h3 className="font-bold text-lg mb-3 flex items-center text-yellow-800">
          ⚠️ Important Disclaimer
        </h3>
        <div className="text-sm text-gray-700 space-y-3">
          <p>
            <strong className="text-yellow-800">Not Investment Advice:</strong> Spark Investment AI is a personal
            portfolio tracking and analytics tool. We do NOT provide investment advice,
            recommendations, or trading services.
          </p>
          <p>
            <strong className="text-yellow-800">Educational Purposes Only:</strong> All information, analysis, and
            predictions provided by this platform are for educational and informational
            purposes only.
          </p>
          <p>
            <strong className="text-yellow-800">Not SEBI Registered:</strong> This platform is NOT registered with
            SEBI (Securities and Exchange Board of India) as an investment advisor or
            stock broker.
          </p>
          <p>
            <strong className="text-yellow-800">Your Responsibility:</strong> You are solely responsible for all
            investment decisions you make. We strongly recommend consulting with a
            SEBI-registered investment advisor before making any investment decisions.
          </p>
          <p>
            <strong className="text-yellow-800">Risk Warning:</strong> Trading and investing in securities involves
            significant risk. You may lose some or all of your invested capital.
          </p>
          <p>
            <strong className="text-yellow-800">No Guarantees:</strong> Past performance does not guarantee future
            results. AI predictions and analysis do not guarantee profits or protect
            against losses.
          </p>
        </div>
      </div>
    );
  }

  // Short version for footer
  return (
    <p className="text-xs text-gray-600 text-center py-2">
      <strong>Disclaimer:</strong> Not investment advice. For educational purposes only.
      Consult a SEBI-registered advisor before investing. Trading involves risk.
    </p>
  );
}

export default Disclaimer;
