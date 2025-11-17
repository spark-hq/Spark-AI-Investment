import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

// Create Auth Context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// Token expiry times (in milliseconds)
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Local storage keys
const STORAGE_KEYS = {
  USER: 'spark_user',
  ACCESS_TOKEN: 'spark_access_token',
  REFRESH_TOKEN: 'spark_refresh_token',
  TOKEN_EXPIRY: 'spark_token_expiry',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ===================================
  // Clear Auth Data Helper
  // ===================================
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ===================================
  // Token Refresh Logic
  // ===================================
  const attemptTokenRefresh = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        clearAuthData();
        return false;
      }

      // Call real API through authAPI service
      const result = await authAPI.refreshToken(refreshToken);

      if (!result.success) {
        throw new Error(result.error || 'Token refresh failed');
      }

      const { token: newAccessToken, refreshToken: newRefreshToken } = result.data;
      const newExpiry = Date.now() + ACCESS_TOKEN_EXPIRY;
      
      // Update tokens in localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, newExpiry.toString());

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Refresh failed, logout
      clearAuthData();
      return false;
    }
  }, [clearAuthData]);

  // ===================================
  // Initialize Auth State from LocalStorage
  // ===================================
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

        if (storedUser && accessToken && tokenExpiry) {
          const expiryTime = parseInt(tokenExpiry, 10);
          const now = Date.now();

          // Check if token is still valid
          if (now < expiryTime) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token expired, try to refresh
            await attemptTokenRefresh();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [attemptTokenRefresh, clearAuthData]);

  // ===================================
  // Auto Token Refresh Timer
  // ===================================
  useEffect(() => {
    if (!isAuthenticated) return;

    // Set up timer to refresh token before it expires
    const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!tokenExpiry) return;

    const expiryTime = parseInt(tokenExpiry, 10);
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    // Refresh 2 minutes before expiry
    const refreshTime = timeUntilExpiry - (2 * 60 * 1000);

    if (refreshTime > 0) {
      const refreshTimer = setTimeout(() => {
        attemptTokenRefresh();
      }, refreshTime);

      return () => clearTimeout(refreshTimer);
    } else {
      // Token already expired or about to expire
      attemptTokenRefresh();
    }
  }, [isAuthenticated, attemptTokenRefresh]);

  // ===================================
  // Login Function
  // ===================================
  const login = useCallback(async (email, password, keepSignedIn = false) => {
    try {
      // Call real API through authAPI service
      const result = await authAPI.login(email, password, keepSignedIn);

      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

      const { user, token, refreshToken } = result.data;
      const tokenExpiry = Date.now() + ACCESS_TOKEN_EXPIRY;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenExpiry.toString());

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Signup Function
  // ===================================
  const signup = useCallback(async (userData) => {
    try {
      // Call real API through authAPI service
      const result = await authAPI.signup(userData);

      if (!result.success) {
        throw new Error(result.error || 'Signup failed');
      }

      const { user, token, refreshToken } = result.data;
      const tokenExpiry = Date.now() + ACCESS_TOKEN_EXPIRY;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenExpiry.toString());

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Logout Function
  // ===================================
  const logout = useCallback(async () => {
    try {
      // Call real API through authAPI service
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data regardless of API response
      clearAuthData();
    }
  }, [clearAuthData]);

  // ===================================
  // Update User Profile
  // ===================================
  const updateUserProfile = useCallback((updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  // ===================================
  // Update User Preferences
  // ===================================
  const updatePreferences = useCallback((preferences) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences },
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  // ===================================
  // Send OTP (Forgot Password)
  // ===================================
  const sendOTP = useCallback(async (email) => {
    try {
      // Call real API through authAPI service
      const result = await authAPI.forgotPassword(email);

      if (!result.success) {
        throw new Error(result.error || 'Failed to send OTP');
      }

      return { 
        success: true, 
        message: result.message || 'OTP sent successfully',
        data: result.data 
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Verify OTP (Mock - can be extended for real verification)
  // ===================================
  const verifyOTP = useCallback(async (email, otp) => {
    try {
      // This is a mock verification for now
      // In real app, this could be a separate API endpoint
      // For password reset flow, verification happens in resetPassword()
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock OTP verification logic
      const storedOTP = sessionStorage.getItem(`otp_${email}`);
      const otpExpiry = sessionStorage.getItem(`otp_expiry_${email}`);

      if (!storedOTP || !otpExpiry) {
        throw new Error('OTP not found or expired');
      }

      if (Date.now() > parseInt(otpExpiry, 10)) {
        sessionStorage.removeItem(`otp_${email}`);
        sessionStorage.removeItem(`otp_expiry_${email}`);
        throw new Error('OTP expired');
      }

      if (storedOTP !== otp) {
        throw new Error('Invalid OTP');
      }

      // Clear OTP after successful verification
      sessionStorage.removeItem(`otp_${email}`);
      sessionStorage.removeItem(`otp_expiry_${email}`);

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Reset Password
  // ===================================
  const resetPassword = useCallback(async (email, newPassword, otp) => {
    try {
      // Call real API through authAPI service
      const result = await authAPI.resetPassword(email, otp, newPassword);

      if (!result.success) {
        throw new Error(result.error || 'Password reset failed');
      }

      return { 
        success: true, 
        message: result.message || 'Password reset successfully' 
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ===================================
  // Context Value
  // ===================================
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUserProfile,
    updatePreferences,
    sendOTP,
    verifyOTP,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;