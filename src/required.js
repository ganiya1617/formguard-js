'use strict';

/**
 * Validates that a field has a non-empty value.
 * @param {*} value
 * @param {Object} options - { message }
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateRequired(value, options) {
  options = options || {};
  if (value === null || value === undefined) {
    return { valid: false, error: options.message || 'This field is required' };
  }
  const str = String(value).trim();
  if (!str) {
    return { valid: false, error: options.message || 'This field is required' };
  }
  return { valid: true, error: null };
}

module.exports = { validateRequired };
