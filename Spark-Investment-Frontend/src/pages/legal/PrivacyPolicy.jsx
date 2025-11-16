// Privacy Policy Page

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-6 bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <div className="prose prose-indigo max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information necessary to provide portfolio tracking and analysis services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Portfolio Data:</strong> Your investment holdings, transactions, and performance metrics</li>
              <li><strong>Trading Platform Credentials:</strong> API keys and access tokens (encrypted)</li>
              <li><strong>Usage Data:</strong> How you interact with the platform, features used, settings</li>
              <li><strong>Device Information:</strong> Browser type, IP address, device identifiers</li>
              <li><strong>Preferences:</strong> Your notification settings, display preferences, safety limits</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              Your information is used solely to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide portfolio tracking and analysis services</li>
              <li>Generate AI-powered insights and recommendations</li>
              <li>Execute trades on your behalf (only with your explicit permission)</li>
              <li>Sync data with your connected trading platforms</li>
              <li>Send you notifications based on your preferences</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Encryption:</strong> All data is encrypted at rest and in transit using AES-256 and TLS 1.3</li>
              <li><strong>Secure Storage:</strong> Sensitive credentials are stored using secure vaults</li>
              <li><strong>API Security:</strong> All API connections use HTTPS with certificate validation</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
              <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
              <li><strong>No Plain Text:</strong> We never store passwords or API keys in plain text</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Sharing</h2>
            <p className="text-gray-700 mb-4">
              <strong className="text-indigo-600">We do NOT sell or share your personal data</strong> with
              third parties for marketing purposes. We only share data when:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to do so</li>
              <li><strong>Broker APIs:</strong> To sync your portfolio data (as necessary for the service)</li>
              <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
              <li><strong>Service Providers:</strong> Trusted partners who help operate our service (under strict NDAs)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the following rights regarding your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of all data we have about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and all associated data</li>
              <li><strong>Export:</strong> Download your data in a portable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from notifications and marketing</li>
              <li><strong>Revoke Consent:</strong> Withdraw permissions at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your data as follows:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Active Accounts:</strong> Data retained as long as your account is active</li>
              <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days of account deletion</li>
              <li><strong>Legal Requirements:</strong> Some data retained longer to comply with tax/regulatory requirements</li>
              <li><strong>Anonymized Data:</strong> May retain anonymized analytics data indefinitely</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
              <li>Improve platform performance</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can disable cookies in your browser settings, but this may limit functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We integrate with third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Broker APIs:</strong> Zerodha, Groww, Upstox, etc. (governed by their privacy policies)</li>
              <li><strong>Market Data Providers:</strong> For real-time stock prices and market information</li>
              <li><strong>Cloud Providers:</strong> For hosting and data storage</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Each third-party service has its own privacy policy. We encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              This platform is not intended for users under 18 years of age. We do not knowingly
              collect data from children. If you believe we have inadvertently collected data from
              a minor, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Data Breach Notification</h2>
            <p className="text-gray-700 mb-4">
              In the unlikely event of a data breach that affects your personal information, we will:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Notify you within 72 hours of discovery</li>
              <li>Explain what data was compromised</li>
              <li>Describe the steps we're taking to address the breach</li>
              <li>Provide recommendations to protect yourself</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. International Users</h2>
            <p className="text-gray-700 mb-4">
              This platform is designed for Indian users and complies with Indian data protection laws.
              If you access from outside India, your data may be transferred to and processed in India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Compliance</h2>
            <p className="text-gray-700 mb-4">
              This privacy policy complies with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
              <li>Information Technology Act, 2000</li>
              <li>Information Technology (Reasonable Security Practices) Rules, 2011</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. We will notify you of significant
              changes via email or platform notification. Your continued use after changes constitutes
              acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For privacy-related questions or to exercise your data rights, contact us at:
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-gray-700 font-mono text-sm">
                Email: privacy@sparkinvestment.ai<br />
                (This is a demo - email not monitored)
              </p>
            </div>
          </section>

          <section className="mb-8 bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">✓ Your Privacy Matters</h2>
            <p className="text-green-700 mb-4">
              We take your privacy seriously. Your financial data is sensitive, and we're committed to
              protecting it with the highest security standards.
            </p>
            <ul className="list-disc list-inside text-green-700 space-y-2 ml-4">
              <li>We don't sell your data - EVER</li>
              <li>We encrypt everything</li>
              <li>You're in control of your data</li>
              <li>You can delete your account anytime</li>
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

export default PrivacyPolicy;
