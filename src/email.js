'use strict';

/**
 * Validates an email address.
 * @param {string} value - The email to validate.
 * @param {Object} options - { required, message }
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateEmail(value, options) {
  options = options || {};
  const val = (value === null || value === undefined) ? '' : String(value);
  const trimmed = val.trim();

  if (!trimmed) {
    if (options.required) {
      return { valid: false, error: options.message || 'Email is required' };
    }
    return { valid: true, error: null };
  }

  if (!trimmed.includes('@')) {
    return { valid: false, error: options.message || 'Email must contain @ symbol' };
  }

  const parts = trimmed.split('@');
  const domain = parts[parts.length - 1];
  if (!domain.includes('.')) {
    return { valid: false, error: options.message || 'Invalid email domain' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: options.message || 'Invalid email format' };
  }

  return { valid: true, error: null };
}

module.exports = { validateEmail };
