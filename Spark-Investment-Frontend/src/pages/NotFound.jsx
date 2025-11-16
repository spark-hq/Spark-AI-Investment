import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8 mt-16">
          <h1 className="text-9xl font-bold text-blue-600 animate-bounce">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, you can navigate back to safety!
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 text-8xl">
          🧭
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg">
              🏠 Go to Home
            </Button>
          </Link>
          <Link to="/calculator">
            <Button size="lg" variant="outline">
              🧮 Try Calculator
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 mb-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Home
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/calculator" className="text-blue-600 hover:text-blue-700 font-medium">
              Calculator
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/results" className="text-blue-600 hover:text-blue-700 font-medium">
              Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;