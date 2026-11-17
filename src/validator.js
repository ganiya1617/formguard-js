'use strict';

const { validateEmail } = require('./email.js');
const { validatePassword } = require('./password.js');
const { validatePhone } = require('./phone.js');
const { validateRequired } = require('./required.js');
const { validateLength } = require('./length.js');
const { validateCustom } = require('./custom.js');

/**
 * Validates a single field given its name, value, and rules.
 * @param {string} fieldName
 * @param {*} value
 * @param {Object} rules - { required, type, minLength, maxLength, ... }
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateField(fieldName, value, rules) {
  rules = rules || {};
  const type = rules.type || 'required';

  if (type === 'email') {
    return validateEmail(value, { required: rules.required !== false, ...rules });
  }

  if (type === 'password') {
    return validatePassword(value, { required: rules.required !== false, ...rules });
  }

  if (type === 'phone') {
    return validatePhone(value, { required: rules.required !== false, ...rules });
  }

  if (type === 'length') {
    // Check required first if set
    if (rules.required !== false) {
      const req = validateRequired(value, rules);
      if (!req.valid) return req;
    }
    return validateLength(value, rules);
  }

  if (type === 'custom') {
    return validateCustom(value, rules.ruleName, rules);
  }

  // Default: required check
  if (rules.required !== false) {
    const req = validateRequired(value, rules);
    if (!req.valid) return req;
  }

  // Length check if min/max provided
  if (rules.minLength !== undefined || rules.maxLength !== undefined) {
    return validateLength(value, { min: rules.minLength, max: rules.maxLength, message: rules.message });
  }

  return { valid: true, error: null };
}

/**
 * Auto-detect field type from field name.
 * @param {string} fieldName
 * @returns {string}
 */
function detectType(fieldName) {
  const name = fieldName.toLowerCase();
  if (name === 'email' || name.endsWith('email')) return 'email';
  if (name === 'password' || name.endsWith('password')) return 'password';
  if (name === 'phone' || name === 'phonenumber' || name === 'mobile') return 'phone';
  return 'required';
}

/**
 * Validates an entire data object against a schema (or auto-detects types).
 * @param {Object} data
 * @param {Object} [schema] - { fieldName: { type, required, ... }, ... }
 * @returns {{ valid: boolean, errors: Object }}
 */
function validate(data, schema) {
  data = data || {};
  const errors = {};
  let valid = true;

  if (schema) {
    // Schema-driven validation
    for (const key of Object.keys(schema)) {
      const rules = schema[key] || {};
      const result = validateField(key, data[key], rules);
      if (!result.valid) {
        errors[key] = result.error;
        valid = false;
      }
    }
  } else {
    // Auto-detect from key names
    for (const key of Object.keys(data)) {
      const type = detectType(key);
      const rules = { type, required: true };
      const result = validateField(key, data[key], rules);
      if (!result.valid) {
        errors[key] = result.error;
        valid = false;
      }
    }
  }

  return { valid, errors };
}

module.exports = { validate, validateField };
