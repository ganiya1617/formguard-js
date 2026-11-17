'use strict';

/** @type {Map<string, { fn: Function, errorMessage: string }>} */
const rules = new Map();

/**
 * Registers a custom validation rule.
 * @param {string} name
 * @param {Function} fn - Returns true if valid, false otherwise.
 * @param {string} errorMessage
 */
function registerRule(name, fn, errorMessage) {
  rules.set(name, { fn, errorMessage: errorMessage || `Validation failed for rule "${name}"` });
}

/**
 * Validates a value using a registered named rule.
 * @param {*} value
 * @param {string} ruleName
 * @param {Object} options - { message }
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateCustom(value, ruleName, options) {
  options = options || {};
  const rule = rules.get(ruleName);
  if (!rule) {
    return { valid: false, error: `Validation rule "${ruleName}" not found` };
  }
  const result = rule.fn(value);
  if (!result) {
    return { valid: false, error: options.message || rule.errorMessage };
  }
  return { valid: true, error: null };
}

/**
 * Returns the registered rule or null.
 * @param {string} name
 * @returns {{ fn: Function, errorMessage: string }|null}
 */
function getRule(name) {
  return rules.get(name) || null;
}

/**
 * Clears all registered rules (useful in tests).
 */
function clearRules() {
  rules.clear();
}

module.exports = { registerRule, validateCustom, getRule, clearRules };
