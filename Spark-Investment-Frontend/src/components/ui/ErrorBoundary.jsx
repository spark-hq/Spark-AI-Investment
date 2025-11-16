// ===================================
// Error Boundary Component
// ===================================
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    if (import.meta.env.PROD) {
      // Send to error tracking service
      // errorTrackingService.log(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-6 rounded-full">
                <AlertTriangle className="text-red-600" size={64} />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 text-center mb-8">
              We're sorry for the inconvenience. An unexpected error occurred while
              loading this page.
            </p>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Error Details (Development Mode):
                </h2>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold text-red-600">Error:</span>
                    <p className="text-gray-700 mt-1 font-mono text-xs">
                      {this.state.error.toString()}
                    </p>
                  </div>
                  {this.state.errorInfo && (
                    <div className="text-sm">
                      <span className="font-semibold text-red-600">Stack Trace:</span>
                      <pre className="text-gray-700 mt-1 font-mono text-xs overflow-auto max-h-48 bg-white p-3 rounded border">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2"
              >
                <RefreshCw size={20} />
                <span>Try Again</span>
              </Button>

              <Button
                onClick={this.handleGoHome}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center justify-center space-x-2"
              >
                <Home size={20} />
                <span>Go Home</span>
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-500 mt-8">
              If this problem persists, please{' '}
              <a
                href="mailto:support@sparkinvestment.com"
                className="text-indigo-600 hover:underline"
              >
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

// Simple error display component for use in queries
export const ErrorDisplay = ({ error, retry }) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <div className="bg-red-100 p-3 rounded-lg">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to Load Data
          </h3>
          <p className="text-red-700 text-sm mb-4">
            {error?.message || 'An unexpected error occurred'}
          </p>
          {retry && (
            <Button
              onClick={retry}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
