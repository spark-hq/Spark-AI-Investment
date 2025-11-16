// ===================================
// Loading Spinner Component
// ===================================
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', fullScreen = false, message = 'Loading...' }) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const iconSize = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64,
  };

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2
              size={iconSize[size]}
              className="text-indigo-600 animate-spin"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse" />
          </div>
          {message && (
            <p className="text-gray-600 font-medium animate-pulse">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // Inline spinner
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 size={iconSize[size]} className="text-indigo-600 animate-spin" />
      {message && <span className="text-gray-600 text-sm">{message}</span>}
    </div>
  );
};

// Card loading skeleton
export const LoadingSkeleton = ({ lines = 3 }) => {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
};

// Table loading skeleton
export const TableLoadingSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-8 bg-gray-200 rounded flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Page loading component
export const PageLoading = ({ message = 'Loading page...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <LoadingSpinner size="xl" message={message} />
    </div>
  );
};

export default LoadingSpinner;
