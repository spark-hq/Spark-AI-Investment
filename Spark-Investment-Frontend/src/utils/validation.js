// ===================================
// Form Validation Utilities
// ===================================

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: '' };
};

/**
 * Password validation
 * Requirements: minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string, strength: string }
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required', strength: 'none' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const missingRequirements = [];

  if (!hasUppercase) missingRequirements.push('one uppercase letter');
  if (!hasLowercase) missingRequirements.push('one lowercase letter');
  if (!hasNumber) missingRequirements.push('one number');
  if (!hasSpecialChar) missingRequirements.push('one special character');

  if (missingRequirements.length > 0) {
    return {
      isValid: false,
      error: `Password must contain ${missingRequirements.join(', ')}`,
      strength: 'weak',
    };
  }

  // Calculate strength
  let strength = 'medium';
  if (password.length >= 12 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
    strength = 'strong';
  }

  return { isValid: true, error: '', strength };
};

/**
 * Confirm password validation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true, error: '' };
};

/**
 * Name validation
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }

  // Only allow letters, spaces, and common name characters
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true, error: '' };
};

/**
 * Phone validation (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove spaces, hyphens, and other common separators
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');

  // Indian phone number: 10 digits, optionally with +91 or 91 prefix
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;

  if (!phoneRegex.test(cleanedPhone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit Indian phone number' };
  }

  return { isValid: true, error: '' };
};

/**
 * Date of Birth validation
 * @param {string} dob - Date of birth (YYYY-MM-DD format)
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateDOB = (dob) => {
  if (!dob || dob.trim() === '') {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const dobDate = new Date(dob);
  const today = new Date();

  // Check if valid date
  if (isNaN(dobDate.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }

  // Check if date is not in future
  if (dobDate > today) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }

  // Calculate age
  const age = Math.floor((today - dobDate) / (365.25 * 24 * 60 * 60 * 1000));

  // Check minimum age (18 for trading/investing)
  if (age < 18) {
    return { isValid: false, error: 'You must be at least 18 years old to register' };
  }

  // Check maximum age (150 years)
  if (age > 150) {
    return { isValid: false, error: 'Please enter a valid date of birth' };
  }

  return { isValid: true, error: '' };
};

/**
 * OTP validation
 * @param {string} otp - OTP to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateOTP = (otp) => {
  if (!otp || otp.trim() === '') {
    return { isValid: false, error: 'OTP is required' };
  }

  // OTP should be 6 digits
  const otpRegex = /^\d{6}$/;

  if (!otpRegex.test(otp)) {
    return { isValid: false, error: 'OTP must be a 6-digit number' };
  }

  return { isValid: true, error: '' };
};

/**
 * Generic required field validation
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || value.toString().trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate entire form
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((fieldName) => {
    const validationFn = validationRules[fieldName];
    const value = formData[fieldName];

    const result = validationFn(value);

    if (!result.isValid) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Get password strength indicator
 * @param {string} password - Password to check
 * @returns {Object} { strength: string, color: string, percentage: number }
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { strength: 'None', color: 'gray', percentage: 0 };
  }

  const validation = validatePassword(password);

  const strengthMap = {
    weak: { strength: 'Weak', color: 'red', percentage: 33 },
    medium: { strength: 'Medium', color: 'yellow', percentage: 66 },
    strong: { strength: 'Strong', color: 'green', percentage: 100 },
  };

  return strengthMap[validation.strength] || strengthMap.weak;
};
