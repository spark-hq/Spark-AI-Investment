import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateOTP } from '../../utils/validation';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendOTP, resetPassword, isAuthenticated } = useAuth();

  // Step state
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const totalSteps = 4;

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Resend OTP timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Step 1: Email validation
  const validateStep1 = () => {
    const emailValidation = validateEmail(formData.email);

    setErrors({
      email: emailValidation.error,
    });

    setTouched({
      email: true,
    });

    return emailValidation.isValid;
  };

  // Step 2: OTP validation
  const validateStep2 = () => {
    const otpValidation = validateOTP(formData.otp);

    setErrors({
      otp: otpValidation.error,
    });

    setTouched({
      otp: true,
    });

    return otpValidation.isValid;
  };

  // Step 3: Password validation
  const validateStep3 = () => {
    const passwordValidation = validatePassword(formData.newPassword);
    const confirmPasswordValidation =
      formData.newPassword === formData.confirmPassword
        ? { isValid: true, error: '' }
        : { isValid: false, error: 'Passwords do not match' };

    setErrors({
      newPassword: passwordValidation.error,
      confirmPassword: confirmPasswordValidation.error,
    });

    setTouched({
      newPassword: true,
      confirmPassword: true,
    });

    return passwordValidation.isValid && confirmPasswordValidation.isValid;
  };

  // Handle Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await sendOTP(formData.email);

      if (result.success) {
        setCurrentStep(2);
        setResendTimer(60);
      } else {
        setErrors({ form: result.error || 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsSubmitting(true);
    const result = await sendOTP(formData.email);
    setIsSubmitting(false);

    if (result.success) {
      setResendTimer(60);
      setErrors({});
    } else {
      setErrors({ form: result.error || 'Failed to resend OTP. Please try again.' });
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    // Move to next step (no API call needed, verification happens in final step)
    setCurrentStep(3);
    setErrors({});
  };

  // Handle Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await resetPassword(formData.email, formData.newPassword, formData.otp);

      if (result.success) {
        setCurrentStep(4);
      } else {
        setErrors({ form: result.error || 'Failed to reset password. Please try again.' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Spark Investment
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {currentStep === 4 ? 'Password Reset Successful' : 'Reset Password'}
          </h2>
          <p className="text-gray-600">
            {currentStep === 1 && "Enter your email to receive a verification code"}
            {currentStep === 2 && "Enter the verification code sent to your email"}
            {currentStep === 3 && "Create a new password for your account"}
            {currentStep === 4 && "Your password has been reset successfully"}
          </p>
        </div>

        {/* Progress Indicator */}
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                    step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            <div className="text-center text-sm font-semibold text-gray-600">
              Step {currentStep} of {totalSteps - 1}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
          {/* Form Error */}
          {errors.form && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-800 font-medium">{errors.form}</p>
            </div>
          )}

          {/* Step 1: Email Input */}
          {currentStep === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
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
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  Verification Code
                </label>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Code sent to <strong>{formData.email}</strong>
                </p>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('otp')}
                  className={`block w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-center text-2xl font-bold tracking-widest ${
                    errors.otp && touched.otp
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                  placeholder="000000"
                />
                {errors.otp && touched.otp && (
                  <p className="mt-2 text-sm text-red-600 flex items-center justify-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.otp}</span>
                  </p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isSubmitting}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                >
                  <span>Verify Code</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Demo Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Demo Mode:</strong> Check console for the OTP code
                </p>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {currentStep === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('newPassword')}
                    className={`block w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.newPassword && touched.newPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.newPassword}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`block w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword && touched.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <CheckCircle2 size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="text-green-600" size={64} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Complete!</h3>
                <p className="text-gray-600">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl group"
              >
                <span>Sign In Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
