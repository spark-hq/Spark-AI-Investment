import { Link } from 'react-router-dom';
import { Sparkles, Mail, Twitter, Github, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">Spark Investment</span>
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                AI
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Your AI-powered investment assistant for tracking portfolios, live trading, 
              and making data-driven decisions across all your investments.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-200 hover:-translate-y-1"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-200 hover:-translate-y-1"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-200 hover:-translate-y-1"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:hello@sparkinvestment.com"
                className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-200 hover:-translate-y-1"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/investments"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Investments
                </Link>
              </li>
              <li>
                <Link
                  to="/calculator"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-analysis"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>AI Analysis</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/live-trading"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Live Trading
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>⚠️ Disclaimer</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Platform Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm mb-4">Integrated with leading platforms:</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-gray-400 text-sm">
              📱 Zerodha
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-gray-400 text-sm">
              🌱 Groww
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-gray-400 text-sm">
              📈 Upstox
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-gray-400 text-sm">
              ₿ Binance
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <p>&copy; {currentYear} Spark Investment AI. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Disclaimer
              </Link>
            </div>

            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
              <span>by Spark Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;