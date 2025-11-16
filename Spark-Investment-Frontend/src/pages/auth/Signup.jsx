import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateDOB,
  validateOTP,
  getPasswordStrength,
} from '../../utils/validation';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, sendOTP, verifyOTP, isAuthenticated } = useAuth();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: KYC-lite
    phone: '',
    dob: '',
    // Step 3: Risk Profile
    riskAppetite: 'moderate',
    investmentHorizon: 'medium',
    // Step 4: Verification
    otp: '',
    agreeToTerms: false,
  });

  // Errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Step 1 validation
  const validateStep1 = () => {
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);

    const stepErrors = {
      name: nameValidation.error,
      email: emailValidation.error,
      password: passwordValidation.error,
      confirmPassword: confirmPasswordValidation.error,
    };

    setErrors(stepErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return (
      nameValidation.isValid &&
      emailValidation.isValid &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid
    );
  };

  // Step 2 validation
  const validateStep2 = () => {
    const phoneValidation = validatePhone(formData.phone);
    const dobValidation = validateDOB(formData.dob);

    const stepErrors = {
      phone: phoneValidation.error,
      dob: dobValidation.error,
    };

    setErrors(stepErrors);
    setTouched({
      phone: true,
      dob: true,
    });

    return phoneValidation.isValid && dobValidation.isValid;
  };

  // Step 3 validation
  const validateStep3 = () => {
    // Risk profile has default values, so always valid
    return true;
  };

  // Step 4 validation
  const validateStep4 = () => {
    const otpValidation = validateOTP(formData.otp);

    const stepErrors = {
      otp: otpValidation.error,
      agreeToTerms: formData.agreeToTerms ? '' : 'You must accept the terms and conditions',
    };

    setErrors(stepErrors);
    setTouched({
      otp: true,
      agreeToTerms: true,
    });

    return otpValidation.isValid && formData.agreeToTerms;
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        // Send OTP when moving to step 4
        if (isValid && !otpSent) {
          setIsSubmitting(true);
          const result = await sendOTP(formData.email);
          setIsSubmitting(false);
          if (result.success) {
            setOtpSent(true);
            setResendTimer(60); // 60 second cooldown
          } else {
            setErrors({ form: result.error || 'Failed to send OTP. Please try again.' });
            return;
          }
        }
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      setErrors({});
      setTouched({});
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep4()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Verify OTP first
      const otpResult = await verifyOTP(formData.email, formData.otp);

      if (!otpResult.success) {
        setErrors({ otp: otpResult.error || 'Invalid OTP. Please try again.' });
        setIsSubmitting(false);
        return;
      }

      // Create account
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        riskProfile: {
          appetite: formData.riskAppetite,
          horizon: formData.investmentHorizon,
        },
      };

      const result = await signup(signupData);

      if (result.success) {
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        setErrors({ form: result.error || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress bar
  const progress = (currentStep / totalSteps) * 100;

  // Password strength indicator
  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Start your investment journey with AI-powered insights</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax={totalSteps} aria-label={`Signup progress: Step ${currentStep} of ${totalSteps}`}>
          <div className="flex justify-between mb-3">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step < currentStep
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  aria-label={`Step ${step}: ${step < currentStep ? 'Completed' : step === currentStep ? 'Current' : 'Not started'}`}
                  aria-current={step === currentStep ? 'step' : undefined}
                >
                  {step < currentStep ? <CheckCircle2 size={20} aria-hidden="true" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm font-semibold text-gray-600" aria-live="polite">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
          <form onSubmit={handleSubmit} aria-label="Multi-step signup form">
            {/* Form Error */}
            {errors.form && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3" role="alert" aria-live="polite" aria-atomic="true">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                <p className="text-sm text-red-800 font-medium">{errors.form}</p>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-600 mt-1">Let's start with your details</p>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('name')}
                      className={`block w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.name && touched.name
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
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

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('password')}
                      className={`block w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.password && touched.password
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
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                        <span
                          className={`text-xs font-bold ${
                            passwordStrength.color === 'green'
                              ? 'text-green-600'
                              : passwordStrength.color === 'yellow'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {passwordStrength.strength}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.color === 'green'
                              ? 'bg-green-500'
                              : passwordStrength.color === 'yellow'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${passwordStrength.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {errors.password && touched.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
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
              </div>
            )}

            {/* Step 2: KYC-lite Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">KYC Information</h3>
                  <p className="text-sm text-gray-600 mt-1">Required for trading and compliance</p>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('phone')}
                      className={`block w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.phone && touched.phone
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                      }`}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('dob')}
                      max={new Date().toISOString().split('T')[0]}
                      className={`block w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.dob && touched.dob
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                      }`}
                    />
                  </div>
                  {errors.dob && touched.dob && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.dob}</span>
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">You must be at least 18 years old to register</p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Why do we need this?</strong> Phone and DOB are required for KYC compliance and to
                    enable trading features.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Risk Profile */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Risk Profile</h3>
                  <p className="text-sm text-gray-600 mt-1">Help us personalize your investment strategy</p>
                </div>

                {/* Risk Appetite */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Target className="inline mr-2" size={18} />
                    Risk Appetite
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        value: 'conservative',
                        label: 'Conservative',
                        description: 'Lower risk, stable returns',
                        icon: Shield,
                        color: 'green',
                      },
                      {
                        value: 'moderate',
                        label: 'Moderate',
                        description: 'Balanced risk and returns',
                        icon: TrendingUp,
                        color: 'blue',
                      },
                      {
                        value: 'aggressive',
                        label: 'Aggressive',
                        description: 'Higher risk, potential for higher returns',
                        icon: Zap,
                        color: 'red',
                      },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <label
                          key={option.value}
                          className={`flex items-start space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            formData.riskAppetite === option.value
                              ? `border-${option.color}-500 bg-${option.color}-50`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="riskAppetite"
                            value={option.value}
                            checked={formData.riskAppetite === option.value}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <div className="flex-shrink-0">
                            <Icon
                              className={
                                formData.riskAppetite === option.value
                                  ? `text-${option.color}-600`
                                  : 'text-gray-400'
                              }
                              size={24}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Investment Horizon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Clock className="inline mr-2" size={18} />
                    Investment Horizon
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'short', label: 'Short-term (< 1 year)', description: 'Quick returns' },
                      { value: 'medium', label: 'Medium-term (1-5 years)', description: 'Balanced growth' },
                      { value: 'long', label: 'Long-term (5+ years)', description: 'Wealth building' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          formData.investmentHorizon === option.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="investmentHorizon"
                          value={option.value}
                          checked={formData.investmentHorizon === option.value}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Verify Your Email</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We've sent a 6-digit code to <strong>{formData.email}</strong>
                  </p>
                </div>

                {/* OTP Input */}
                <div>
                  <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                    Enter OTP
                  </label>
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

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || isSubmitting}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>

                {/* Terms and Conditions */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('agreeToTerms')}
                      className={`mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-2 rounded cursor-pointer ${
                        errors.agreeToTerms && touched.agreeToTerms ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && touched.agreeToTerms && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.agreeToTerms}</span>
                    </p>
                  )}
                </div>

                {/* Demo Info */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>Demo Mode:</strong> Check console for the OTP code
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between space-x-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
