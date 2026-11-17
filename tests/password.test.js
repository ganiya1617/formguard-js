'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert');
const { validatePassword, checkPasswordStrength } = require('../src/password.js');

describe('Password Validation', () => {
  // Strong password
  test('strong password Hello@123 is valid', () => {
    const r = validatePassword('Hello@123', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Weak passwords
  test('weak password abc is invalid (too short)', () => {
    const r = validatePassword('abc', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Password must be at least 8 characters');
  });

  test('password without uppercase fails', () => {
    const r = validatePassword('hello@123', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Password must contain at least one uppercase letter');
  });

  test('password without number fails', () => {
    const r = validatePassword('Hello@abc', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Password must contain at least one number');
  });

  test('password without special character fails', () => {
    const r = validatePassword('Hello123', {});
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Password must contain at least one special character');
  });

  // Empty required password
  test('empty required password → error', () => {
    const r = validatePassword('', { required: true });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Password is required');
  });

  test('empty non-required password → valid', () => {
    const r = validatePassword('', {});
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // Custom minLength
  test('custom minLength:12 rejects shorter password', () => {
    const r = validatePassword('Hello@12', { minLength: 12 });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Password must be at least 12 characters');
  });

  test('custom minLength:12 accepts longer valid password', () => {
    const r = validatePassword('Hello@123456', { minLength: 12 });
    assert.strictEqual(r.valid, true);
    assert.strictEqual(r.error, null);
  });

  // maxLength exceeded
  test('maxLength exceeded → error', () => {
    const r = validatePassword('Hello@123', { maxLength: 5 });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Password must not exceed 5 characters');
  });

  // Custom error message
  test('custom message overrides default', () => {
    const r = validatePassword('abc', { message: 'Password too weak' });
    assert.strictEqual(r.valid, false);
    assert.strictEqual(r.error, 'Password too weak');
  });
});

describe('Password Strength', () => {
  // Strong password: Hello@123 — all 6 checks pass
  test('Hello@123 → Strong with score 6', () => {
    const r = checkPasswordStrength('Hello@123', {});
    assert.strictEqual(r.strength, 'Strong');
    assert.strictEqual(r.score, 6);
  });

  test('Hello@123 checks object is all true', () => {
    const r = checkPasswordStrength('Hello@123', {});
    assert.strictEqual(r.checks.minLength, true);
    assert.strictEqual(r.checks.maxLength, true);
    assert.strictEqual(r.checks.uppercase, true);
    assert.strictEqual(r.checks.lowercase, true);
    assert.strictEqual(r.checks.number, true);
    assert.strictEqual(r.checks.specialCharacter, true);
  });

  // Weak: 'abc' — minLength fails (< 8), maxLength passes, uppercase fails, lowercase passes, number fails, special fails
  // score = 2 (maxLength + lowercase), totalChecks=6, ceil(6/2)=3, score(2) < 3 → Weak
  test('abc → Weak', () => {
    const r = checkPasswordStrength('abc', {});
    assert.strictEqual(r.strength, 'Weak');
    assert.strictEqual(r.checks.minLength, false);
    assert.strictEqual(r.checks.uppercase, false);
    assert.strictEqual(r.checks.lowercase, true);
    assert.strictEqual(r.checks.number, false);
    assert.strictEqual(r.checks.specialCharacter, false);
  });

  // Medium: 'Hello123' — minLength✓ maxLength✓ uppercase✓ lowercase✓ number✓ special✗ → score=5, totalChecks=6, 5<6 and 5>=3 → Medium
  test('Hello123 → Medium (missing special char)', () => {
    const r = checkPasswordStrength('Hello123', {});
    assert.strictEqual(r.strength, 'Medium');
    assert.strictEqual(r.score, 5);
    assert.strictEqual(r.checks.specialCharacter, false);
  });

  // Strength levels correct
  test('strength levels: Weak/Medium/Strong are the only possibilities', () => {
    const weak = checkPasswordStrength('abc', {});
    const medium = checkPasswordStrength('Hello123', {});
    const strong = checkPasswordStrength('Hello@123', {});
    assert.ok(['Weak', 'Medium', 'Strong'].includes(weak.strength));
    assert.ok(['Weak', 'Medium', 'Strong'].includes(medium.strength));
    assert.ok(['Weak', 'Medium', 'Strong'].includes(strong.strength));
  });

  // checks object has correct boolean values
  test('checks object contains boolean values', () => {
    const r = checkPasswordStrength('Hello@123', {});
    for (const key of Object.keys(r.checks)) {
      assert.strictEqual(typeof r.checks[key], 'boolean');
    }
  });

  // maxLength exceeded in strength
  // A very long password would fail maxLength check
  test('password exceeding maxLength → maxLength check is false', () => {
    const longPass = 'Hello@123'.repeat(20); // 180 chars, default max 128
    const r = checkPasswordStrength(longPass, {});
    assert.strictEqual(r.checks.maxLength, false);
  });
});
