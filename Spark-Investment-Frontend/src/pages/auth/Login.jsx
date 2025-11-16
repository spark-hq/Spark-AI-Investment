import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validateRequired } from '../../utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepSignedIn: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Real-time validation
  useEffect(() => {
    if (touched.email) {
      const emailValidation = validateEmail(formData.email);
      setErrors((prev) => ({ ...prev, email: emailValidation.error }));
    }
  }, [formData.email, touched.email]);

  useEffect(() => {
    if (touched.password) {
      const passwordValidation = validateRequired(formData.password, 'Password');
      setErrors((prev) => ({ ...prev, password: passwordValidation.error }));
    }
  }, [formData.password, touched.password]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear form error when user starts typing
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validateRequired(formData.password, 'Password');

    setErrors({
      email: emailValidation.error,
      password: passwordValidation.error,
      form: '',
    });

    setTouched({
      email: true,
      password: true,
    });

    return emailValidation.isValid && passwordValidation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, form: '' }));

    try {
      const result = await login(formData.email, formData.password, formData.keepSignedIn);

      if (result.success) {
        // Redirect to return URL or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setErrors((prev) => ({
          ...prev,
          form: result.error || 'Login failed. Please check your credentials.',
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: 'An unexpected error occurred. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 mb-6"
            aria-label="Go to Spark Investment homepage"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg" aria-hidden="true">
              <Sparkles className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Spark Investment
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your investment dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login form">
            {/* Form Error */}
            {errors.form && (
              <div
                className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
              >
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                <p className="text-sm text-red-800 font-medium">{errors.form}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                  aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')}
                  className={`block w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email && touched.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && touched.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center space-x-1" role="alert">
                  <AlertCircle size={14} aria-hidden="true" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                  aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('password')}
                  className={`block w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password && touched.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                >
                  {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center space-x-1" role="alert">
                  <AlertCircle size={14} aria-hidden="true" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Keep Signed In & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="keepSignedIn"
                  name="keepSignedIn"
                  type="checkbox"
                  checked={formData.keepSignedIn}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="keepSignedIn" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Keep me signed in
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-live="polite"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">New to Spark Investment?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6">
            <Link
              to="/signup"
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold text-base hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 group"
            >
              <span>Create an Account</span>
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium text-center">
            <strong>Demo Mode:</strong> Use any email and password to sign in
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
