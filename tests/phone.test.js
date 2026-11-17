'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert');
const { validatePhone } = require('../src/phone.js');

describe('Phone Validation', () => {
  // Valid Indian number
  test('valid Indian number 9876543210 → valid', () => {
    const r = validatePhone('9876543210', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Valid with country code
  test('valid with country code +919876543210 → valid', () => {
    const r = validatePhone('+919876543210', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  test('valid with country code without + 919876543210 → valid', () => {
    const r = validatePhone('919876543210', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Invalid: too short
  test('invalid 123 (too short) → invalid', () => {
    const r = validatePhone('123', {});
    assert.strictEqual(r.valid, false);
    assert.ok(r.error);
  });

  // Invalid: non-numeric
  test('invalid abc1234567 (non-numeric) → invalid', () => {
    const r = validatePhone('abc1234567', {});
    assert.strictEqual(r.valid, false);
    assert.ok(r.error);
    assert.strictEqual(r.error, 'Phone number must contain only digits');
  });

  // Empty required
  test('empty required → error', () => {
    const r = validatePhone('', { required: true });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Phone number is required');
  });

  // Empty non-required
  test('empty non-required → valid', () => {
    const r = validatePhone('', { required: false });
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Number starting with 5 (invalid for India)
  test('number starting with 5 (invalid for India) → invalid', () => {
    const r = validatePhone('5876543210', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Invalid phone number format');
  });

  // Number starting with 9 → valid (avoid 91xxxxxxxx which triggers dial code strip)
  test('number starting with 9 → valid', () => {
    const r = validatePhone('9023456789', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Number starting with 6 → valid (India allows 6-9)
  test('number starting with 6 → valid', () => {
    const r = validatePhone('6123456789', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Number starting with 7 → valid
  test('number starting with 7 → valid', () => {
    const r = validatePhone('7123456789', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Number starting with 8 → valid
  test('number starting with 8 → valid', () => {
    const r = validatePhone('8123456789', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Custom minLength/maxLength (non-IN country)
  test('custom minLength option with US country (non-IN)', () => {
    // country not in COUNTRY_CONFIG → uses generic minLength/maxLength
    const r = validatePhone('12345', { country: 'US', minLength: 10 });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Phone number must be at least 10 digits');
  });

  test('custom maxLength option with US country (non-IN)', () => {
    const r = validatePhone('12345678901234567', { country: 'US', maxLength: 15 });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Phone number must not exceed 15 digits');
  });

  test('valid number within custom min/max (non-IN country)', () => {
    const r = validatePhone('1234567890', { country: 'US', minLength: 10, maxLength: 15 });
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Custom message
  test('custom message overrides default', () => {
    const r = validatePhone('', { required: true, message: 'Phone required' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Phone required');
  });
});
