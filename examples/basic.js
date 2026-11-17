'use strict';

/**
 * examples/basic.js — Basic usage examples for FormGuard.
 * Run with: node examples/basic.js
 */

const FormGuard = require('../src/index.js');

console.log('=== FormGuard Basic Examples ===\n');

// --- Email validation ---
console.log('--- Email Validation ---');
console.log(FormGuard.isEmail('user@example.com'));          // { valid: true, error: null }
console.log(FormGuard.isEmail('', { required: true }));     // { valid: false, error: 'Email is required' }
console.log(FormGuard.isEmail('notanemail'));                // { valid: false, error: 'Email must contain @ symbol' }
console.log(FormGuard.isEmail('user@nodomain'));             // { valid: false, error: 'Invalid email domain' }

// --- Password validation ---
console.log('\n--- Password Validation ---');
console.log(FormGuard.checkPassword('Hello@123'));           // { valid: true, error: null }
console.log(FormGuard.checkPassword('weak'));                // { valid: false, error: '...' }

// --- Password strength ---
console.log('\n--- Password Strength ---');
console.log(FormGuard.passwordStrength('Hello@123'));        // Strong
console.log(FormGuard.passwordStrength('hello'));            // Weak

// --- Phone validation ---
console.log('\n--- Phone Validation ---');
console.log(FormGuard.isPhone('9876543210'));                // { valid: true, error: null }
console.log(FormGuard.isPhone('+919876543210'));             // { valid: true, error: null }
console.log(FormGuard.isPhone('12345', { required: true }));// { valid: false, error: '...' }

// --- Required validation ---
console.log('\n--- Required Validation ---');
console.log(FormGuard.isRequired('hello'));                  // { valid: true, error: null }
console.log(FormGuard.isRequired(''));                       // { valid: false, error: 'This field is required' }
console.log(FormGuard.isRequired(null));                     // { valid: false, error: 'This field is required' }

// --- Length validation ---
console.log('\n--- Length Validation ---');
console.log(FormGuard.checkLength('hello', { min: 3, max: 10 })); // { valid: true, error: null }
console.log(FormGuard.checkLength('hi', { min: 3 }));             // { valid: false, error: 'Must be at least 3 characters' }

// --- Custom rule ---
console.log('\n--- Custom Rule ---');
FormGuard.addRule('isPositive', (v) => Number(v) > 0, 'Value must be positive');
console.log(FormGuard.validateWith(5, 'isPositive'));        // { valid: true, error: null }
console.log(FormGuard.validateWith(-1, 'isPositive'));       // { valid: false, error: 'Value must be positive' }

// --- Batch validate (auto-detect) ---
console.log('\n--- Batch Validate (auto-detect) ---');
const result1 = FormGuard.validate({
  email: 'user@example.com',
  password: 'Hello@123',
  phone: '9876543210',
});
console.log(result1);  // { valid: true, errors: {} }

const result2 = FormGuard.validate({
  email: '',
  password: 'weak',
  phone: '123',
});
console.log(result2);  // { valid: false, errors: { email: ..., password: ..., phone: ... } }

// --- Schema-driven validate ---
console.log('\n--- Schema-driven Validate ---');
const schema = {
  username: { type: 'required', minLength: 3, maxLength: 20 },
  email: { type: 'email', required: true },
  password: { type: 'password', required: true, minLength: 8 },
};
const result3 = FormGuard.validate(
  { username: 'john', email: 'john@example.com', password: 'Secure@99' },
  schema
);
console.log(result3);  // { valid: true, errors: {} }

console.log('\n✅ All examples ran successfully!');
