'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert');
const { validateEmail } = require('../src/email.js');

describe('Email Validation', () => {
  // Valid emails
  test('valid email test@example.com passes', () => {
    const r = validateEmail('test@example.com', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  test('valid email user.name+tag@domain.co.uk passes', () => {
    const r = validateEmail('user.name+tag@domain.co.uk', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  test('valid email user@sub.domain.com passes', () => {
    const r = validateEmail('user@sub.domain.com', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Invalid emails
  test('invalid: notanemail fails', () => {
    const r = validateEmail('notanemail', {});
    assert.strictEqual(r.valid, false);
    assert.ok(r.error);
  });

  test('invalid: missing@ fails', () => {
    const r = validateEmail('missing@', {});
    assert.strictEqual(r.valid, false);
    assert.ok(r.error);
  });

  test('invalid: @nodomain fails', () => {
    const r = validateEmail('@nodomain', {});
    assert.strictEqual(r.valid, false);
    assert.ok(r.error);
  });

  test('invalid: no-at-sign fails', () => {
    const r = validateEmail('no-at-sign', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Email must contain @ symbol');
  });

  test('invalid: user@.com fails (invalid domain)', () => {
    const r = validateEmail('user@.com', {});
    assert.strictEqual(r.valid, false);
    assert.ok(r.error);
  });

  test('invalid: empty string without required → valid', () => {
    const r = validateEmail('', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Required checks
  test('required=true with empty value → error', () => {
    const r = validateEmail('', { required: true });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Email is required');
  });

  test('required=true with whitespace-only → error', () => {
    const r = validateEmail('   ', { required: true });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Email is required');
  });

  test('required=false with empty value → valid', () => {
    const r = validateEmail('', { required: false });
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Custom message
  test('custom message override for required empty', () => {
    const r = validateEmail('', { required: true, message: 'Please enter your email' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Please enter your email');
  });

  test('custom message override for missing @ symbol', () => {
    const r = validateEmail('notanemail', { message: 'Bad email' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Bad email');
  });

  // @ symbol detection
  test('missing @ symbol returns correct error message', () => {
    const r = validateEmail('userdomain.com', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Email must contain @ symbol');
  });

  // Invalid domain detection
  test('domain without dot returns invalid domain error', () => {
    const r = validateEmail('user@nodot', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Invalid email domain');
  });
});
