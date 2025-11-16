// Terms of Service Page

function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-6 bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>

        <div className="prose prose-indigo max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Spark Investment AI ("the Platform"), you accept and agree to be
              bound by the terms and provisions of this agreement. If you do not agree to these terms,
              please do not use the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Personal Use Only</h2>
            <p className="text-gray-700 mb-4">
              This platform is designed for personal portfolio tracking and analysis.
              It is not intended for commercial use, redistribution, or resale.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. No Investment Advice</h2>
            <p className="text-gray-700 mb-4">
              <strong className="text-red-600">IMPORTANT:</strong> Spark Investment AI does NOT provide
              investment advice or recommendations. All information is for educational purposes only.
              We are NOT registered with SEBI (Securities and Exchange Board of India) as an investment
              advisor or stock broker.
            </p>
            <p className="text-gray-700 mb-4">
              Any analysis, predictions, or insights provided by the platform's AI features are
              automated outputs based on historical data and algorithms. They should not be considered
              as professional investment advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. User Responsibility</h2>
            <p className="text-gray-700 mb-4">
              You are solely responsible for all investment decisions you make. You acknowledge that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Investing involves substantial risk and you may lose money</li>
              <li>You should consult with a SEBI-registered investment advisor before making decisions</li>
              <li>You will conduct your own due diligence before any investment</li>
              <li>You understand the risks associated with stock market investments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Accuracy</h2>
            <p className="text-gray-700 mb-4">
              While we strive to provide accurate information, we do not guarantee that all data,
              analysis, or predictions will be error-free, current, or complete. Market data may be
              delayed or inaccurate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Liability Limitation</h2>
            <p className="text-gray-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, we shall not be liable for any losses, damages,
              or claims arising from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Your use of this platform</li>
              <li>Any investment decisions you make</li>
              <li>Errors or inaccuracies in data</li>
              <li>System downtime or technical issues</li>
              <li>Unauthorized access to your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              This platform may integrate with third-party services (broker APIs, market data providers).
              You are responsible for complying with their respective terms of service. We are not
              responsible for any third-party service failures or changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Auto-Trading Features</h2>
            <p className="text-gray-700 mb-4">
              If you enable automated trading features:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You authorize the platform to execute trades on your behalf</li>
              <li>You understand that automated trades carry additional risks</li>
              <li>You set appropriate safety limits and controls</li>
              <li>You monitor your account regularly</li>
              <li>You can disable auto-trading at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Account Security</h2>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the security of your account credentials.
              Never share your passwords or API keys with anyone. Report any unauthorized access immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Modifications to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Continued use of the platform
              after modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate your access to the platform at any time,
              with or without notice, for any reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms shall be governed by and construed in accordance with the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of courts in India.
            </p>
          </section>

          <section className="mb-8 bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-4">⚠️ Final Warning</h2>
            <p className="text-red-700 font-semibold mb-4">
              BY USING THIS PLATFORM, YOU ACKNOWLEDGE THAT:
            </p>
            <ul className="list-disc list-inside text-red-700 space-y-2 ml-4">
              <li>This is NOT a SEBI-registered investment advisory service</li>
              <li>We do NOT provide investment recommendations</li>
              <li>All decisions and their consequences are YOURS alone</li>
              <li>You may lose money - possibly all of it</li>
              <li>Past performance does NOT guarantee future results</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Last Updated: November 9, 2025
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
