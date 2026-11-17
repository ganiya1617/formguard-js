'use strict';

const { validateEmail } = require('./email.js');
const { validatePassword, checkPasswordStrength } = require('./password.js');
const { validatePhone } = require('./phone.js');
const { validateRequired } = require('./required.js');
const { validateLength } = require('./length.js');
const { registerRule, validateCustom, getRule, clearRules } = require('./custom.js');
const { validate, validateField } = require('./validator.js');

const FormGuard = {
  validate,
  validateField,
  isEmail(value, options) { return validateEmail(value, options || {}); },
  isPhone(value, options) { return validatePhone(value, options || {}); },
  isRequired(value, options) { return validateRequired(value, options || {}); },
  checkLength(value, options) { return validateLength(value, options || {}); },
  checkPassword(value, options) { return validatePassword(value, options || {}); },
  passwordStrength(value, options) { return checkPasswordStrength(value, options || {}); },
  addRule: registerRule,
  validateWith: validateCustom,
  getRule,
  clearRules,
};

module.exports = FormGuard;
module.exports.default = FormGuard;
