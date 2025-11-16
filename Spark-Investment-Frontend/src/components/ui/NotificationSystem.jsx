// ===================================
// Notification System Component
// ===================================
import { Toaster } from 'react-hot-toast';

const NotificationSystem = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
          maxWidth: '500px',
        },

        // Success notification style
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '2px solid #86efac',
          },
        },

        // Error notification style
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '2px solid #fca5a5',
          },
        },

        // Loading notification style
        loading: {
          iconTheme: {
            primary: '#6366f1',
            secondary: '#fff',
          },
          style: {
            background: '#eef2ff',
            color: '#3730a3',
            border: '2px solid #c7d2fe',
          },
        },

        // Custom notification style
        custom: {
          duration: 4000,
        },
      }}
    />
  );
};

// ===================================
// Notification Helper Functions
// ===================================
import toast from 'react-hot-toast';

// Success notification
export const notifySuccess = (message, options = {}) => {
  return toast.success(message, {
    ...options,
  });
};

// Error notification
export const notifyError = (message, options = {}) => {
  return toast.error(message, {
    ...options,
  });
};

// Loading notification
export const notifyLoading = (message, options = {}) => {
  return toast.loading(message, {
    ...options,
  });
};

// Info notification (custom)
export const notifyInfo = (message, options = {}) => {
  return toast(message, {
    icon: '💡',
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '2px solid #bfdbfe',
    },
    ...options,
  });
};

// Warning notification (custom)
export const notifyWarning = (message, options = {}) => {
  return toast(message, {
    icon: '⚠️',
    style: {
      background: '#fffbeb',
      color: '#92400e',
      border: '2px solid #fde68a',
    },
    ...options,
  });
};

// Promise notification (for async operations)
export const notifyPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred',
    },
    {
      loading: {
        style: {
          background: '#eef2ff',
          color: '#3730a3',
        },
      },
      success: {
        duration: 3000,
        style: {
          background: '#f0fdf4',
          color: '#166534',
        },
      },
      error: {
        duration: 5000,
        style: {
          background: '#fef2f2',
          color: '#991b1b',
        },
      },
    }
  );
};

// Dismiss notification
export const dismissNotification = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all notifications
export const dismissAllNotifications = () => {
  toast.dismiss();
};

// ===================================
// Notification Examples (for documentation)
// ===================================

// Example 1: Simple success
// notifySuccess('Trade executed successfully!');

// Example 2: Error with action button
// notifyError('Failed to connect to platform', {
//   action: {
//     label: 'Retry',
//     onClick: () => connectPlatform(),
//   },
// });

// Example 3: Loading that updates to success/error
// const toastId = notifyLoading('Processing trade...');
// try {
//   await executeTrade();
//   toast.success('Trade completed!', { id: toastId });
// } catch (error) {
//   toast.error('Trade failed', { id: toastId });
// }

// Example 4: Promise notification
// notifyPromise(
//   fetchPortfolio(),
//   {
//     loading: 'Loading portfolio...',
//     success: 'Portfolio loaded!',
//     error: 'Failed to load portfolio',
//   }
// );

export default NotificationSystem;
