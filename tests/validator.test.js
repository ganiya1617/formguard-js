'use strict';
const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const FormGuard = require('../src/index.js');

describe('FormGuard.validate() - multi-field', () => {
  test('all valid fields → { valid: true, errors: {} }', () => {
    const result = FormGuard.validate(
      { email: 'test@example.com', password: 'Hello@123' },
      {
        email: { type: 'email', required: true },
        password: { type: 'password', required: true },
      }
    );
    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.errors, {});
  });

  test('one invalid field → valid: false, errors has only that field', () => {
    const result = FormGuard.validate(
      { email: 'bademail', password: 'Hello@123' },
      {
        email: { type: 'email', required: true },
        password: { type: 'password', required: true },
      }
    );
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.email);
    assert.strictEqual(result.errors.password, undefined);
  });

  test('ALL invalid → all fields in errors (one bad field must NOT stop others)', () => {
    const result = FormGuard.validate(
      { email: 'bademail', password: 'abc' },
      {
        email: { type: 'email', required: true },
        password: { type: 'password', required: true },
      }
    );
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.email);
    assert.ok(result.errors.password);
  });
});

describe('FormGuard.validate() - schema-based', () => {
  test('type email with invalid value → error', () => {
    const result = FormGuard.validate(
      { email: 'notvalid' },
      { email: { type: 'email', required: true } }
    );
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.email);
  });

  test('type password with minLength option', () => {
    const result = FormGuard.validate(
      { password: 'short' },
      { password: { type: 'password', required: true, minLength: 10 } }
    );
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.password);
  });

  test('type phone with valid number', () => {
    const result = FormGuard.validate(
      { phone: '9876543210' },
      { phone: { type: 'phone', required: true } }
    );
    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.errors, {});
  });

  test('type phone with invalid number', () => {
    const result = FormGuard.validate(
      { phone: '123' },
      { phone: { type: 'phone', required: true } }
    );
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.phone);
  });

  test('required:true with empty value → error', () => {
    const result = FormGuard.validate(
      { name: '' },
      { name: { required: true } }
    );
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.name);
  });
});

describe('FormGuard.validate() - auto-detect (no schema)', () => {
  test('auto-detect: email key with invalid value → error', () => {
    const result = FormGuard.validate({ email: 'notanemail' });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.email);
  });

  test('auto-detect: password key with valid value → valid', () => {
    const result = FormGuard.validate({ password: 'Hello@123' });
    assert.strictEqual(result.valid, true);
  });

  test('auto-detect: phone key with invalid value → error', () => {
    const result = FormGuard.validate({ phone: '123' });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.phone);
  });

  test('auto-detect: email key with valid email → valid', () => {
    const result = FormGuard.validate({ email: 'test@example.com' });
    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.errors, {});
  });
});

describe('FormGuard custom rules', () => {
  beforeEach(() => {
    FormGuard.clearRules();
  });

  test('register and use a custom rule → valid', () => {
    FormGuard.addRule('noSpaces', (v) => !v.includes(' '), 'No spaces allowed');
    const r = FormGuard.validateWith('hello', 'noSpaces', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  test('register and use a custom rule → invalid', () => {
    FormGuard.addRule('noSpaces', (v) => !v.includes(' '), 'No spaces allowed');
    const r = FormGuard.validateWith('hello world', 'noSpaces', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'No spaces allowed');
  });

  test('custom rule not found → error', () => {
    const r = FormGuard.validateWith('hello', 'nonExistentRule', {});
    assert.strictEqual(r.valid, false);
    assert.ok(r.error.includes('not found'));
  });

  test('custom rule with message option overrides rule message', () => {
    FormGuard.addRule('noSpaces', (v) => !v.includes(' '), 'No spaces allowed');
    const r = FormGuard.validateWith('hello world', 'noSpaces', { message: 'Custom override' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Custom override');
  });
});

describe('FormGuard.validateField()', () => {
  test('validateField with email type → valid', () => {
    const r = FormGuard.validateField('email', 'test@example.com', { type: 'email' });
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  test('validateField with email type → invalid', () => {
    const r = FormGuard.validateField('email', 'bademail', { type: 'email' });
    assert.strictEqual(r.valid, false);
    assert.ok(r.error);
  });

  test('validateField with phone type → valid', () => {
    const r = FormGuard.validateField('phone', '9876543210', { type: 'phone' });
    assert.strictEqual(r.valid, true);
  });

  test('validateField with password type → invalid (too short)', () => {
    const r = FormGuard.validateField('password', 'abc', { type: 'password' });
    assert.strictEqual(r.valid, false);
    assert.ok(r.error);
  });
});

describe('FormGuard length validation', () => {
  test('checkLength: value within min and max → valid', () => {
    const r = FormGuard.checkLength('hello', { min: 3, max: 10 });
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  test('checkLength: value below min → error', () => {
    const r = FormGuard.checkLength('hi', { min: 5 });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Must be at least 5 characters');
  });

  test('checkLength: value above max → error', () => {
    const r = FormGuard.checkLength('hello world', { max: 5 });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Must not exceed 5 characters');
  });
});

describe('FormGuard required field', () => {
  test('isRequired: whitespace-only string → invalid', () => {
    const r = FormGuard.isRequired('   ', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'This field is required');
  });

  test('isRequired: null → invalid', () => {
    const r = FormGuard.isRequired(null, {});
    assert.strictEqual(r.valid, false);
  });

  test('isRequired: valid value → valid', () => {
    const r = FormGuard.isRequired('hello', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  test('validate() required field: whitespace-only → invalid', () => {
    const result = FormGuard.validate(
      { name: '   ' },
      { name: { required: true } }
    );
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.name);
  });
});

describe('FormGuard custom error messages override defaults', () => {
  test('isEmail with custom message → uses custom message', () => {
    const r = FormGuard.isEmail('', { required: true, message: 'Email needed' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Email needed');
  });

  test('checkPassword with custom message → uses custom message', () => {
    const r = FormGuard.checkPassword('abc', { message: 'Too weak' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Too weak');
  });

  test('isPhone with custom message → uses custom message', () => {
    const r = FormGuard.isPhone('', { required: true, message: 'Enter phone' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Enter phone');
  });

  test('checkLength with custom message → uses custom message', () => {
    const r = FormGuard.checkLength('hi', { min: 5, message: 'Too short!' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Too short!');
  });
});
