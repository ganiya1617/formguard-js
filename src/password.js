'use strict';

/**
 * Validates a password.
 * @param {string} value
 * @param {Object} options - { required, minLength, maxLength, uppercase, lowercase, number, specialCharacter, message }
 * @returns {{ valid: boolean, error: string|null }}
 */
function validatePassword(value, options) {
  options = options || {};
  const minLength = options.minLength !== undefined ? options.minLength : 8;
  const maxLength = options.maxLength !== undefined ? options.maxLength : 128;
  const checkUppercase = options.uppercase !== false;
  const checkLowercase = options.lowercase !== false;
  const checkNumber = options.number !== false;
  const checkSpecial = options.specialCharacter !== false;

  const val = (value === null || value === undefined) ? '' : String(value);

  if (!val) {
    if (options.required) {
      return { valid: false, error: options.message || 'Password is required' };
    }
    return { valid: true, error: null };
  }

  if (val.length < minLength) {
    return { valid: false, error: options.message || `Password must be at least ${minLength} characters` };
  }

  if (val.length > maxLength) {
    return { valid: false, error: options.message || `Password must not exceed ${maxLength} characters` };
  }

  if (checkUppercase && !/[A-Z]/.test(val)) {
    return { valid: false, error: options.message || 'Password must contain at least one uppercase letter' };
  }

  if (checkLowercase && !/[a-z]/.test(val)) {
    return { valid: false, error: options.message || 'Password must contain at least one lowercase letter' };
  }

  if (checkNumber && !/[0-9]/.test(val)) {
    return { valid: false, error: options.message || 'Password must contain at least one number' };
  }

  if (checkSpecial && !/[^A-Za-z0-9]/.test(val)) {
    return { valid: false, error: options.message || 'Password must contain at least one special character' };
  }

  return { valid: true, error: null };
}

/**
 * Checks password strength.
 * @param {string} value
 * @param {Object} options - { minLength, maxLength, uppercase, lowercase, number, specialCharacter }
 * @returns {{ strength: string, score: number, checks: Object }}
 */
function checkPasswordStrength(value, options) {
  options = options || {};
  const minLength = options.minLength !== undefined ? options.minLength : 8;
  const maxLength = options.maxLength !== undefined ? options.maxLength : 128;
  const checkUppercase = options.uppercase !== false;
  const checkLowercase = options.lowercase !== false;
  const checkNumber = options.number !== false;
  const checkSpecial = options.specialCharacter !== false;

  const val = (value === null || value === undefined) ? '' : String(value);

  const checks = {};
  let totalChecks = 0;
  let score = 0;

  // minLength check
  totalChecks++;
  checks.minLength = val.length >= minLength;
  if (checks.minLength) score++;

  // maxLength check
  totalChecks++;
  checks.maxLength = val.length <= maxLength;
  if (checks.maxLength) score++;

  if (checkUppercase) {
    totalChecks++;
    checks.uppercase = /[A-Z]/.test(val);
    if (checks.uppercase) score++;
  }

  if (checkLowercase) {
    totalChecks++;
    checks.lowercase = /[a-z]/.test(val);
    if (checks.lowercase) score++;
  }

  if (checkNumber) {
    totalChecks++;
    checks.number = /[0-9]/.test(val);
    if (checks.number) score++;
  }

  if (checkSpecial) {
    totalChecks++;
    checks.specialCharacter = /[^A-Za-z0-9]/.test(val);
    if (checks.specialCharacter) score++;
  }

  let strength;
  if (score === totalChecks) {
    strength = 'Strong';
  } else if (score < Math.ceil(totalChecks / 2)) {
    strength = 'Weak';
  } else {
    strength = 'Medium';
  }

  return { strength, score, checks };
}

module.exports = { validatePassword, checkPasswordStrength };
