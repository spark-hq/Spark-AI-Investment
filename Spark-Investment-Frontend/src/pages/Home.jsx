import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Disclaimer from "../components/legal/Disclaimer";
import {
  Sparkles,
  TrendingUp,
  Bot,
  Zap,
  Shield,
  LineChart,
  Wallet,
  Brain,
  Target,
  Users,
} from "lucide-react";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-50 via-purple-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fadeIn">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 hover-lift">
            <Sparkles size={16} />
            <span>AI-Powered Investment Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 text-shadow leading-tight">
            Invest Smarter with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              AI Intelligence
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your personal AI assistant for tracking investments, live trading,
            and making data-driven decisions across all your portfolios.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="hover-lift flex items-center group">
                <span>Get Started Free</span>
                <Zap
                  size={18}
                  className="ml-2 group-hover:rotate-12 transition-transform"
                />
              </Button>
            </Link>
            <Link to="/calculator">
              <Button variant="outline" size="lg" className="hover-lift">
                Try Calculator
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield size={16} className="text-green-600" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-blue-600" />
              <span>10K+ Active Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp size={16} className="text-purple-600" />
              <span>₹500Cr+ Tracked</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative animate-scaleIn">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-1 animate-gradient">
            <div className="bg-white rounded-3xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover-lift">
                  <div className="text-5xl mb-3">📊</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Smart Dashboard
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Track all investments in one place
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center hover-lift">
                  <div className="text-5xl mb-3">🤖</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    AI Analysis
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get intelligent recommendations
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center hover-lift">
                  <div className="text-5xl mb-3">⚡</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Live Trading
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Trade with AI assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you make better investment
            decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
          {/* Feature 1 */}
          <Card
            hover
            className="p-8 animate-fadeIn hover-lift border-2 border-transparent hover:border-indigo-200 transition-all"
          >
            <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Multi-Platform Tracking
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Connect Zerodha, Groww, Upstox, and crypto exchanges. Track all
              your investments in one unified dashboard.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card
            hover
            className="p-8 animate-fadeIn hover-lift border-2 border-transparent hover:border-purple-200 transition-all"
          >
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Brain className="text-purple-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get intelligent insights, risk assessments, and future predictions
              powered by advanced AI algorithms.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card
            hover
            className="p-8 animate-fadeIn hover-lift border-2 border-transparent hover:border-green-200 transition-all"
          >
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Zap className="text-green-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Live Trading Assistant
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time trading with AI recommendations, stop-loss suggestions,
              and profit calculations.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card
            hover
            className="p-8 animate-fadeIn hover-lift border-2 border-transparent hover:border-blue-200 transition-all"
          >
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <LineChart className="text-blue-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Investment Calculator
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Calculate SIP, Lumpsum, and Step-up investments with detailed
              projections and visual charts.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card
            hover
            className="p-8 animate-fadeIn hover-lift border-2 border-transparent hover:border-pink-200 transition-all"
          >
            <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Bot className="text-pink-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Smart Auto-Invest
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Let AI automatically invest based on your goals, risk tolerance,
              and market conditions.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card
            hover
            className="p-8 animate-fadeIn hover-lift border-2 border-transparent hover:border-orange-200 transition-all"
          >
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Target className="text-orange-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Goal Tracking
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Set financial goals and track progress with smart milestones and
              achievement celebrations.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to take control of your investments
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 stagger-animation">
            <div className="text-center animate-fadeIn">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 hover-lift shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Connect Accounts
              </h3>
              <p className="text-gray-600">
                Link your trading and investment platforms securely
              </p>
            </div>

            <div className="text-center animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 hover-lift shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Track Portfolio
              </h3>
              <p className="text-gray-600">
                See all your investments in one unified dashboard
              </p>
            </div>

            <div className="text-center animate-fadeIn">
              <div className="bg-gradient-to-br from-pink-600 to-red-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 hover-lift shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Get AI Insights
              </h3>
              <p className="text-gray-600">
                Receive intelligent recommendations and analysis
              </p>
            </div>

            <div className="text-center animate-fadeIn">
              <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 hover-lift shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Make Decisions
              </h3>
              <p className="text-gray-600">
                Trade smarter with data-driven confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Platforms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Seamlessly Connected
          </h2>
          <p className="text-xl text-gray-600">
            Works with all your favorite platforms
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover-lift border-2 border-blue-100">
            <div className="text-4xl mb-3">📱</div>
            <h4 className="font-bold text-gray-800">Zerodha</h4>
            <p className="text-sm text-gray-500 mt-1">Stocks & Mutual Funds</p>
          </Card>
          <Card className="p-6 text-center hover-lift border-2 border-green-100">
            <div className="text-4xl mb-3">🌱</div>
            <h4 className="font-bold text-gray-800">Groww</h4>
            <p className="text-sm text-gray-500 mt-1">Mutual Funds & IPO</p>
          </Card>
          <Card className="p-6 text-center hover-lift border-2 border-purple-100">
            <div className="text-4xl mb-3">📈</div>
            <h4 className="font-bold text-gray-800">Upstox</h4>
            <p className="text-sm text-gray-500 mt-1">Trading & Investing</p>
          </Card>
          <Card className="p-6 text-center hover-lift border-2 border-yellow-100">
            <div className="text-4xl mb-3">₿</div>
            <h4 className="font-bold text-gray-800">Binance</h4>
            <p className="text-sm text-gray-500 mt-1">Cryptocurrency</p>
          </Card>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-white animate-scaleIn hover-lift">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Trusted by Investors Worldwide
            </h2>
            <p className="text-indigo-100">
              Join thousands who are investing smarter
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <p className="text-indigo-100">Active Users</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">₹500Cr+</div>
              <p className="text-indigo-100">Assets Tracked</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <p className="text-indigo-100">AI Insights</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <p className="text-indigo-100">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Investors
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover-lift border-2 border-indigo-100">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The AI analysis feature helped me make better decisions. My
                portfolio returns improved by 25%!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">
                  R
                </div>
                <div>
                  <p className="font-bold text-gray-800">Rahul Sharma</p>
                  <p className="text-sm text-gray-500">Bangalore</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover-lift border-2 border-purple-100">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Finally, all my investments in one place! The live trading
                assistant is a game-changer."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-3">
                  P
                </div>
                <div>
                  <p className="font-bold text-gray-800">Priya Patel</p>
                  <p className="text-sm text-gray-500">Mumbai</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover-lift border-2 border-pink-100">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Simple, powerful, and intelligent. This is the future of
                investment management!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold mr-3">
                  A
                </div>
                <div>
                  <p className="font-bold text-gray-800">Amit Kumar</p>
                  <p className="text-sm text-gray-500">Delhi</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 animate-fadeIn hover-lift shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-white opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto py-12">
            <Sparkles className="mx-auto mb-6 animate-pulse" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Investments?
            </h2>
            <p className="text-xl mb-8 text-indigo-100 leading-relaxed">
              Join thousands of smart investors using AI to make better
              decisions. Start your journey today—completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-indigo-600 hover:bg-gray-100 border-0 hover-lift"
                >
                  Get Started Free →
                </Button>
              </Link>
              <Link to="/investments">
                <Button
                  size="lg"
                  className="bg-indigo-800 hover:bg-indigo-900 hover-lift"
                >
                  View Demo
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-indigo-200">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </Card>
      </section>

      {/* Disclaimer Section - Legal Compliance */}
      <section className="disclaimer-section bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Disclaimer fullVersion />
        </div>
      </section>
    </div>
  );
};

export default Home;
