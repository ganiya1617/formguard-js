'use strict';

// Country code map: country code -> { dialCode, digits, startsWith }
const COUNTRY_CONFIG = {
  IN: { dialCode: '91', digits: 10, startsWith: /^[6-9]/ },
};

/**
 * Validates a phone number.
 * @param {string} value
 * @param {Object} options - { required, minLength, maxLength, country, allowCountryCode, message }
 * @returns {{ valid: boolean, error: string|null }}
 */
function validatePhone(value, options) {
  options = options || {};
  const minLength = options.minLength !== undefined ? options.minLength : 10;
  const maxLength = options.maxLength !== undefined ? options.maxLength : 15;
  const country = options.country !== undefined ? options.country : 'IN';
  const allowCountryCode = options.allowCountryCode !== false;

  const val = (value === null || value === undefined) ? '' : String(value).trim();

  if (!val) {
    if (options.required) {
      return { valid: false, error: options.message || 'Phone number is required' };
    }
    return { valid: true, error: null };
  }

  let digits = val;

  if (allowCountryCode) {
    // Strip leading + if present
    if (digits.startsWith('+')) {
      digits = digits.slice(1);
    }
    // Strip country dial code if present
    const config = COUNTRY_CONFIG[country];
    if (config && digits.startsWith(config.dialCode)) {
      digits = digits.slice(config.dialCode.length);
    }
  }

  // Check only digits remain
  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: options.message || 'Phone number must contain only digits' };
  }

  const config = COUNTRY_CONFIG[country];
  if (config) {
    // Country-specific validation
    if (digits.length !== config.digits) {
      return { valid: false, error: options.message || `Phone number must be ${config.digits} digits` };
    }
    if (config.startsWith && !config.startsWith.test(digits)) {
      return { valid: false, error: options.message || 'Invalid phone number format' };
    }
  } else {
    // Generic: check min/max length
    if (digits.length < minLength) {
      return { valid: false, error: options.message || `Phone number must be at least ${minLength} digits` };
    }
    if (digits.length > maxLength) {
      return { valid: false, error: options.message || `Phone number must not exceed ${maxLength} digits` };
    }
  }

  return { valid: true, error: null };
}

module.exports = { validatePhone };
