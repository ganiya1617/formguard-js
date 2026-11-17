'use strict';

/**
 * Validates the length of a string value.
 * @param {string} value
 * @param {Object} options - { min, max, message }
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateLength(value, options) {
  options = options || {};
  const val = (value === null || value === undefined) ? '' : String(value);
  const len = val.length;

  if (options.min !== undefined && len < options.min) {
    return { valid: false, error: options.message || `Must be at least ${options.min} characters` };
  }

  if (options.max !== undefined && len > options.max) {
    return { valid: false, error: options.message || `Must not exceed ${options.max} characters` };
  }

  return { valid: true, error: null };
}

module.exports = { validateLength };
