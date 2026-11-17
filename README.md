# 🛡️ FormGuard

[![npm version](https://img.shields.io/npm/v/formguard-js.svg?style=flat-square)](https://www.npmjs.com/package/formguard-js)
[![GitHub](https://img.shields.io/badge/GitHub-ganiya1617%2Fformguard--js-blue?style=flat-square&logo=github)](https://github.com/ganiya1617/formguard-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg?style=flat-square)](https://www.npmjs.com/package/formguard-js)
[![Node.js Version](https://img.shields.io/node/v/formguard-js.svg?style=flat-square)](https://nodejs.org)

> A lightweight, developer-friendly JavaScript form validation library for browser and Node.js — zero dependencies, simple API, fully extensible.

---

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [FormGuard.validate()](#formguardvalidate)
  - [FormGuard.validateField()](#formguardvalidatefield)
  - [FormGuard.isEmail()](#formguardisemail)
  - [FormGuard.isPhone()](#formguardisphone)
  - [FormGuard.isRequired()](#formguardisrequired)
  - [FormGuard.checkLength()](#formguardchecklength)
  - [FormGuard.checkPassword()](#formguardcheckpassword)
  - [FormGuard.passwordStrength()](#formguardpasswordstrength)
  - [FormGuard.addRule()](#formguardaddrule)
  - [FormGuard.validateWith()](#formguardvalidatewith)
  - [FormGuard.getRule()](#formguardgetrule)
  - [FormGuard.clearRules()](#formguardclearrules)
- [Individual Validators](#individual-validators)
- [Password Strength](#password-strength)
- [Multi-Field Validation](#multi-field-validation)
- [Schema-Based Validation](#schema-based-validation)
- [Custom Validation Rules](#custom-validation-rules)
- [Custom Error Messages](#custom-error-messages)
- [Browser Usage](#browser-usage)
- [Node.js Usage](#nodejs-usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- ✅ **Email validation** — format, domain, and presence checks
- ✅ **Phone number validation** — country-aware (India and international), country code stripping
- ✅ **Password validation** — configurable rules: uppercase, lowercase, numbers, special characters, length
- ✅ **Password strength meter** — returns `Weak`, `Medium`, or `Strong` with a score and per-check breakdown
- ✅ **Required field validation** — catches `null`, `undefined`, and whitespace-only strings
- ✅ **Length validation** — enforce minimum and/or maximum character counts
- ✅ **Multi-field batch validation** — validate a whole form object in one call
- ✅ **Schema-based validation** — declare rules in a schema object; no repetition
- ✅ **Custom validation rules** — register your own named validators and reuse them anywhere
- ✅ **Custom error messages** — override any default error string with the `message` option
- ✅ **Zero dependencies** — no external packages, ever
- ✅ **Works everywhere** — Node.js (CommonJS & ESM) and browsers (via `<script>` tag)
- ✅ **TypeScript-friendly** — predictable return shapes throughout

---

## 📦 Installation

```bash
npm install formguard-js
```

---

## ⚙️ Requirements

| Requirement | Version |
|---|---|
| Node.js | `>= 14.0.0` |
| Dependencies | **None** |

FormGuard has **zero runtime dependencies**. It works in any modern browser and any Node.js environment from v14 onwards.

---

## 🚀 Quick Start

```javascript
const FormGuard = require('formguard-js');

const result = FormGuard.validate({
  email: 'user@example.com',
  password: 'Secret@123',
  username: 'john_doe',
});

console.log(result);
// {
//   valid: true,
//   errors: {}
// }
```

Validating a form with errors:

```javascript
const result = FormGuard.validate({
  email: 'not-an-email',
  password: '',
});

console.log(result);
// {
//   valid: false,
//   errors: {
//     email: 'Invalid email format',
//     password: 'This field is required'
//   }
// }
```

---

## 📖 API Reference

### `FormGuard.validate()`

Validate multiple fields at once. Optionally accepts a schema to define per-field rules.

#### Signature

```typescript
FormGuard.validate(data: object, schema?: object): { valid: boolean, errors: object }
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `data` | `object` | Yes | Key-value map of field names to values |
| `schema` | `object` | No | Per-field rule definitions (see [Schema-Based Validation](#schema-based-validation)) |

#### Returns

```typescript
{
  valid: boolean,   // true only when every field passes
  errors: {         // map of fieldName → error message string
    [fieldName]: string
  }
}
```

When `valid` is `true`, `errors` is an empty object `{}`.

#### Example

```javascript
const FormGuard = require('formguard-js');

const schema = {
  email:    { required: true, type: 'email' },
  password: { required: true, type: 'password', minLength: 10 },
  phone:    { type: 'phone' },
};

const { valid, errors } = FormGuard.validate(
  { email: 'alice@example.com', password: 'short', phone: '9876543210' },
  schema
);

console.log(valid);  // false
console.log(errors); // { password: 'Password must be at least 10 characters' }
```

---

### `FormGuard.validateField()`

Validate a single field against an array of rule objects.

#### Signature

```typescript
FormGuard.validateField(
  fieldName: string,
  value: any,
  rules: Array<{ rule: string, options?: object }>
): { valid: boolean, error: string | null }
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `fieldName` | `string` | Yes | Display name used in error messages |
| `value` | `any` | Yes | The field value to validate |
| `rules` | `Array` | Yes | Ordered list of rule objects to apply |

Each rule object has:

| Key | Type | Description |
|---|---|---|
| `rule` | `string` | Rule name: `'required'`, `'email'`, `'phone'`, `'password'`, `'length'`, or any custom rule name |
| `options` | `object` | Rule-specific options (optional) |

#### Returns

```typescript
{ valid: boolean, error: string | null }
```

Returns the error from the **first failing rule**. If all rules pass, `error` is `null`.

#### Example

```javascript
const result = FormGuard.validateField('Username', 'ab', [
  { rule: 'required' },
  { rule: 'length', options: { min: 3, max: 20 } },
]);

console.log(result);
// { valid: false, error: 'Must be at least 3 characters' }
```

---

### `FormGuard.isEmail()`

Validate an email address.

#### Signature

```typescript
FormGuard.isEmail(value: string, options?: EmailOptions): { valid: boolean, error: string | null }
```

#### Options — `EmailOptions`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `required` | `boolean` | `false` | Treat empty value as an error |
| `message` | `string` | —  | Override the default error message |

#### Returns

```typescript
{ valid: boolean, error: string | null }
```

#### Example

```javascript
FormGuard.isEmail('hello@world.com');
// { valid: true, error: null }

FormGuard.isEmail('bad-email');
// { valid: false, error: 'Invalid email format' }

FormGuard.isEmail('', { required: true });
// { valid: false, error: 'Email is required' }

FormGuard.isEmail('bad', { message: 'Please enter a valid email address' });
// { valid: false, error: 'Please enter a valid email address' }
```

---

### `FormGuard.isPhone()`

Validate a phone number, with optional country-aware logic and country-code stripping.

#### Signature

```typescript
FormGuard.isPhone(value: string, options?: PhoneOptions): { valid: boolean, error: string | null }
```

#### Options — `PhoneOptions`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `required` | `boolean` | `false` | Treat empty value as an error |
| `minLength` | `number` | `10` | Minimum digit count (after stripping country code) |
| `maxLength` | `number` | `15` | Maximum digit count |
| `country` | `string` | `'IN'` | Country code for country-specific rules (e.g. `'IN'` for India) |
| `allowCountryCode` | `boolean` | `true` | Allow and strip a leading `+` and country code before validation |
| `message` | `string` | — | Override the default error message |

#### Returns

```typescript
{ valid: boolean, error: string | null }
```

#### Example

```javascript
FormGuard.isPhone('9876543210');
// { valid: true, error: null }

FormGuard.isPhone('+919876543210', { country: 'IN', allowCountryCode: true });
// { valid: true, error: null }

FormGuard.isPhone('12345', { required: true });
// { valid: false, error: 'Invalid phone number' }

FormGuard.isPhone('', { required: true });
// { valid: false, error: 'Phone number is required' }
```

---

### `FormGuard.isRequired()`

Check that a value is present and non-empty (not `null`, `undefined`, or whitespace-only).

#### Signature

```typescript
FormGuard.isRequired(value: any, options?: RequiredOptions): { valid: boolean, error: string | null }
```

#### Options — `RequiredOptions`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | `'This field is required'` | Override the default error message |

#### Returns

```typescript
{ valid: boolean, error: string | null }
```

#### Example

```javascript
FormGuard.isRequired('hello');
// { valid: true, error: null }

FormGuard.isRequired('');
// { valid: false, error: 'This field is required' }

FormGuard.isRequired('   ');
// { valid: false, error: 'This field is required' }

FormGuard.isRequired(null, { message: 'Name cannot be blank' });
// { valid: false, error: 'Name cannot be blank' }
```

---

### `FormGuard.checkLength()`

Validate the character length of a string value.

#### Signature

```typescript
FormGuard.checkLength(value: string, options?: LengthOptions): { valid: boolean, error: string | null }
```

#### Options — `LengthOptions`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `min` | `number` | — | Minimum number of characters (inclusive) |
| `max` | `number` | — | Maximum number of characters (inclusive) |
| `message` | `string` | — | Override the default error message |

Both `min` and `max` are optional. You can supply either, both, or neither.

#### Returns

```typescript
{ valid: boolean, error: string | null }
```

#### Example

```javascript
FormGuard.checkLength('hello', { min: 3, max: 10 });
// { valid: true, error: null }

FormGuard.checkLength('hi', { min: 5 });
// { valid: false, error: 'Must be at least 5 characters' }

FormGuard.checkLength('toolongstring', { max: 8 });
// { valid: false, error: 'Must not exceed 8 characters' }

FormGuard.checkLength('x', { min: 3, message: 'Username too short' });
// { valid: false, error: 'Username too short' }
```

---

### `FormGuard.checkPassword()`

Validate a password against configurable complexity rules.

#### Signature

```typescript
FormGuard.checkPassword(value: string, options?: PasswordOptions): { valid: boolean, error: string | null }
```

#### Options — `PasswordOptions`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `required` | `boolean` | `false` | Treat empty value as an error |
| `minLength` | `number` | `8` | Minimum number of characters |
| `maxLength` | `number` | `128` | Maximum number of characters |
| `uppercase` | `boolean` | `true` | Must contain at least one uppercase letter |
| `lowercase` | `boolean` | `true` | Must contain at least one lowercase letter |
| `number` | `boolean` | `true` | Must contain at least one digit |
| `specialCharacter` | `boolean` | `true` | Must contain at least one special character |
| `message` | `string` | — | Override the default error message |

#### Returns

```typescript
{ valid: boolean, error: string | null }
```

Returns an error for the **first failing rule** found in this order: required → minLength → maxLength → uppercase → lowercase → number → specialCharacter.

#### Example

```javascript
FormGuard.checkPassword('Secret@123');
// { valid: true, error: null }

FormGuard.checkPassword('short');
// { valid: false, error: 'Password must be at least 8 characters' }

FormGuard.checkPassword('alllowercase1!');
// { valid: false, error: 'Password must contain at least one uppercase letter' }

FormGuard.checkPassword('NoSpecial1', { specialCharacter: false });
// { valid: true, error: null }

FormGuard.checkPassword('', { required: true });
// { valid: false, error: 'Password is required' }
```

---

### `FormGuard.passwordStrength()`

Measure the strength of a password. Unlike `checkPassword()`, this never returns an error — it always returns a strength assessment.

#### Signature

```typescript
FormGuard.passwordStrength(value: string, options?: PasswordOptions): {
  strength: 'Weak' | 'Medium' | 'Strong',
  score: number,
  checks: {
    minLength: boolean,
    maxLength: boolean,
    uppercase: boolean,
    lowercase: boolean,
    number: boolean,
    specialCharacter: boolean
  }
}
```

#### Options

Accepts the same `PasswordOptions` as `checkPassword()`. Each option you disable is excluded from the score calculation.

#### Returns

| Field | Type | Description |
|---|---|---|
| `strength` | `'Weak' \| 'Medium' \| 'Strong'` | Overall strength label |
| `score` | `number` | Number of checks passed |
| `checks` | `object` | Per-check pass/fail map |

**Strength thresholds** (based on the total number of enabled checks):

- `Weak` — fewer than half the enabled checks pass
- `Medium` — at least half, but not all, checks pass
- `Strong` — all enabled checks pass

#### Example

```javascript
const result = FormGuard.passwordStrength('Secret@123');

console.log(result);
// {
//   strength: 'Strong',
//   score: 6,
//   checks: {
//     minLength: true,
//     maxLength: true,
//     uppercase: true,
//     lowercase: true,
//     number: true,
//     specialCharacter: true
//   }
// }

FormGuard.passwordStrength('password');
// {
//   strength: 'Weak',
//   score: 2,
//   checks: {
//     minLength: true,
//     maxLength: true,
//     uppercase: false,
//     lowercase: true,
//     number: false,
//     specialCharacter: false
//   }
// }
```

---

### `FormGuard.addRule()`

Register a custom named validation rule that can be reused with `validateWith()` or referenced inside `validateField()`.

#### Signature

```typescript
FormGuard.addRule(
  name: string,
  fn: (value: any, options?: object) => boolean,
  errorMessage: string
): void
```

#### Parameters

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Unique rule name (e.g. `'username'`) |
| `fn` | `function` | Validator function — receives `(value, options)`, returns `true` (valid) or `false` (invalid) |
| `errorMessage` | `string` | Default error message when `fn` returns `false` |

#### Example

```javascript
// Register a rule that rejects usernames with spaces
FormGuard.addRule(
  'username',
  (value) => /^[a-zA-Z0-9_]+$/.test(value),
  'Username may only contain letters, numbers, and underscores'
);
```

---

### `FormGuard.validateWith()`

Run a previously registered custom rule against a value.

#### Signature

```typescript
FormGuard.validateWith(
  value: any,
  ruleName: string,
  options?: object
): { valid: boolean, error: string | null }
```

#### Parameters

| Parameter | Type | Description |
|---|---|---|
| `value` | `any` | Value to validate |
| `ruleName` | `string` | Name of a rule registered via `addRule()` |
| `options` | `object` | Passed as the second argument to the rule's `fn` |

#### Returns

```typescript
{ valid: boolean, error: string | null }
```

If `ruleName` does not exist, `valid` is `false` and an appropriate error is returned.

#### Example

```javascript
FormGuard.addRule(
  'username',
  (value) => /^[a-zA-Z0-9_]+$/.test(value),
  'Username may only contain letters, numbers, and underscores'
);

FormGuard.validateWith('john_doe', 'username');
// { valid: true, error: null }

FormGuard.validateWith('john doe', 'username');
// { valid: false, error: 'Username may only contain letters, numbers, and underscores' }
```

---

### `FormGuard.getRule()`

Retrieve a registered custom rule by name.

#### Signature

```typescript
FormGuard.getRule(name: string): { fn: Function, errorMessage: string } | null
```

#### Returns

The rule object `{ fn, errorMessage }` if the rule exists, or `null` if it does not.

#### Example

```javascript
FormGuard.addRule('username', (v) => v.length >= 3, 'Too short');

const rule = FormGuard.getRule('username');
console.log(rule);
// { fn: [Function], errorMessage: 'Too short' }

console.log(FormGuard.getRule('nonexistent')); // null
```

---

### `FormGuard.clearRules()`

Remove all custom rules that have been registered via `addRule()`. Built-in validators are unaffected.

#### Signature

```typescript
FormGuard.clearRules(): void
```

#### Example

```javascript
FormGuard.addRule('username', (v) => v.length >= 3, 'Too short');
FormGuard.addRule('slug', (v) => /^[a-z0-9-]+$/.test(v), 'Invalid slug');

FormGuard.clearRules();

console.log(FormGuard.getRule('username')); // null
console.log(FormGuard.getRule('slug'));     // null
```

> **Note:** Call `clearRules()` between test runs or independent validation contexts to prevent rule-name collisions.

---

## 🔎 Individual Validators

Each validator can be called standalone — no form object required.

### `isEmail()` — Email Validation

```javascript
const FormGuard = require('formguard-js');

// Valid email
console.log(FormGuard.isEmail('alice@example.com'));
// { valid: true, error: null }

// Missing @ symbol
console.log(FormGuard.isEmail('aliceexample.com'));
// { valid: false, error: 'Email must contain @ symbol' }

// Invalid domain
console.log(FormGuard.isEmail('alice@nodot'));
// { valid: false, error: 'Invalid email domain' }

// Required but empty
console.log(FormGuard.isEmail('', { required: true }));
// { valid: false, error: 'Email is required' }

// Optional and empty — passes
console.log(FormGuard.isEmail(''));
// { valid: true, error: null }
```

---

### `isPhone()` — Phone Number Validation

```javascript
// Indian number (default country: 'IN')
console.log(FormGuard.isPhone('9876543210'));
// { valid: true, error: null }

// With country code prefix
console.log(FormGuard.isPhone('+919876543210', { allowCountryCode: true }));
// { valid: true, error: null }

// Invalid (too short)
console.log(FormGuard.isPhone('12345'));
// { valid: false, error: 'Invalid phone number' }

// Required but blank
console.log(FormGuard.isPhone('', { required: true }));
// { valid: false, error: 'Phone number is required' }

// International number with custom length
console.log(FormGuard.isPhone('2025550123', { country: 'US', minLength: 10, maxLength: 10 }));
// { valid: true, error: null }
```

---

### `isRequired()` — Required Field Check

```javascript
// Present value
console.log(FormGuard.isRequired('some text'));
// { valid: true, error: null }

// Empty string
console.log(FormGuard.isRequired(''));
// { valid: false, error: 'This field is required' }

// Whitespace-only
console.log(FormGuard.isRequired('   '));
// { valid: false, error: 'This field is required' }

// null / undefined
console.log(FormGuard.isRequired(null));
// { valid: false, error: 'This field is required' }

// Custom message
console.log(FormGuard.isRequired('', { message: 'Full name is required' }));
// { valid: false, error: 'Full name is required' }
```

---

### `checkLength()` — String Length Validation

```javascript
// Within range
console.log(FormGuard.checkLength('hello', { min: 3, max: 10 }));
// { valid: true, error: null }

// Too short
console.log(FormGuard.checkLength('hi', { min: 5 }));
// { valid: false, error: 'Must be at least 5 characters' }

// Too long
console.log(FormGuard.checkLength('averylongusername', { max: 10 }));
// { valid: false, error: 'Must not exceed 10 characters' }

// Exact length bounds
console.log(FormGuard.checkLength('abc', { min: 3, max: 3 }));
// { valid: true, error: null }
```

---

### `checkPassword()` — Password Validation

```javascript
// Fully valid password
console.log(FormGuard.checkPassword('MyP@ssword1'));
// { valid: true, error: null }

// Too short
console.log(FormGuard.checkPassword('Ab1!'));
// { valid: false, error: 'Password must be at least 8 characters' }

// Missing uppercase
console.log(FormGuard.checkPassword('mypassword1!'));
// { valid: false, error: 'Password must contain at least one uppercase letter' }

// Missing number
console.log(FormGuard.checkPassword('MyPassword!'));
// { valid: false, error: 'Password must contain at least one number' }

// Relaxed rules — no special character required
console.log(FormGuard.checkPassword('MyPassword1', { specialCharacter: false }));
// { valid: true, error: null }

// Minimum length override
console.log(FormGuard.checkPassword('S3cr3t@!', { minLength: 10 }));
// { valid: false, error: 'Password must be at least 10 characters' }
```

---

## 🔐 Password Strength

`passwordStrength()` gives you a detailed breakdown of a password's strength without blocking on failure. Use it for real-time strength indicators in your UI.

```javascript
const FormGuard = require('formguard-js');

// Strong password
const result = FormGuard.passwordStrength('Secret@123');
console.log(result);
// {
//   strength: 'Strong',
//   score: 6,
//   checks: {
//     minLength: true,
//     maxLength: true,
//     uppercase: true,
//     lowercase: true,
//     number: true,
//     specialCharacter: true
//   }
// }

// Medium password
console.log(FormGuard.passwordStrength('Password1'));
// {
//   strength: 'Medium',
//   score: 4,
//   checks: {
//     minLength: true,
//     maxLength: true,
//     uppercase: true,
//     lowercase: true,
//     number: true,
//     specialCharacter: false
//   }
// }

// Weak password
console.log(FormGuard.passwordStrength('password'));
// {
//   strength: 'Weak',
//   score: 2,
//   checks: {
//     minLength: true,
//     maxLength: true,
//     uppercase: false,
//     lowercase: true,
//     number: false,
//     specialCharacter: false
//   }
// }
```

**Using it for a live strength indicator:**

```javascript
const input = document.getElementById('password');
const indicator = document.getElementById('strength-indicator');

input.addEventListener('input', () => {
  const { strength, score } = FormGuard.passwordStrength(input.value);
  indicator.textContent = `Strength: ${strength} (${score}/6)`;
  indicator.className = strength.toLowerCase(); // 'weak', 'medium', 'strong'
});
```

---

## 📋 Multi-Field Validation

### Without a Schema

Pass any object to `validate()`. FormGuard will apply sensible defaults — empty strings are treated as required by default when a key is present.

```javascript
const FormGuard = require('formguard-js');

const { valid, errors } = FormGuard.validate({
  email: 'alice@example.com',
  password: 'Secret@123',
  phone: '9876543210',
});

console.log(valid);  // true
console.log(errors); // {}
```

### With Errors

```javascript
const { valid, errors } = FormGuard.validate({
  email: 'not-an-email',
  password: 'weak',
  phone: '',
});

console.log(valid);  // false
console.log(errors);
// {
//   email: 'Invalid email format',
//   password: 'Password must be at least 8 characters'
// }
```

---

## 🗂️ Schema-Based Validation

Define your validation rules once in a schema object and pass it to `validate()`. This keeps your validation logic clean, declarative, and easy to maintain.

### Schema Key Format

```typescript
{
  [fieldName]: {
    required?:  boolean,
    type?:      'email' | 'password' | 'phone' | 'text',
    minLength?: number,
    maxLength?: number,
  }
}
```

| Key | Type | Description |
|---|---|---|
| `required` | `boolean` | Field must be non-empty |
| `type` | `string` | Triggers the matching built-in validator (`isEmail`, `checkPassword`, `isPhone`, or `checkLength`) |
| `minLength` | `number` | Minimum character count (applies when `type` is `password`, `phone`, or `text`) |
| `maxLength` | `number` | Maximum character count |

### Example

```javascript
const FormGuard = require('formguard-js');

const schema = {
  email: {
    required: true,
    type: 'email',
  },
  password: {
    required: true,
    type: 'password',
    minLength: 10,
  },
  bio: {
    type: 'text',
    maxLength: 300,
  },
  phone: {
    type: 'phone',
  },
};

const formData = {
  email:    'bob@example.com',
  password: 'Str0ng@Pass!',
  bio:      'Developer from India.',
  phone:    '9988776655',
};

const { valid, errors } = FormGuard.validate(formData, schema);
console.log(valid);  // true
console.log(errors); // {}
```

Failing example:

```javascript
const { valid, errors } = FormGuard.validate(
  { email: '', password: 'short', bio: 'x'.repeat(400) },
  schema
);

console.log(valid);  // false
console.log(errors);
// {
//   email:    'Email is required',
//   password: 'Password must be at least 10 characters',
//   bio:      'Must not exceed 300 characters'
// }
```

---

## 🧩 Custom Validation Rules

Register your own named rules with `addRule()` and apply them anywhere via `validateWith()` or inside `validateField()`.

### `addRule()` + `validateWith()` — Username Example

```javascript
const FormGuard = require('formguard-js');

// Register a 'username' rule
FormGuard.addRule(
  'username',
  (value) => /^[a-zA-Z0-9_]{3,20}$/.test(value),
  'Username must be 3–20 characters and may only contain letters, numbers, and underscores'
);

// Use it standalone
console.log(FormGuard.validateWith('john_doe', 'username'));
// { valid: true, error: null }

console.log(FormGuard.validateWith('jo', 'username'));
// { valid: false, error: 'Username must be 3–20 characters and may only contain letters, numbers, and underscores' }

console.log(FormGuard.validateWith('john doe!', 'username'));
// { valid: false, error: 'Username must be 3–20 characters and may only contain letters, numbers, and underscores' }
```

### Using a Custom Rule Inside `validateField()`

```javascript
// Register a 'slug' rule
FormGuard.addRule(
  'slug',
  (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
  'Slug must be lowercase letters, numbers, and hyphens only'
);

const result = FormGuard.validateField('Post Slug', 'my post!', [
  { rule: 'required' },
  { rule: 'slug' },
]);

console.log(result);
// { valid: false, error: 'Slug must be lowercase letters, numbers, and hyphens only' }

console.log(FormGuard.validateField('Post Slug', 'my-post-2024', [
  { rule: 'required' },
  { rule: 'slug' },
]));
// { valid: true, error: null }
```

### Registering Multiple Rules

```javascript
FormGuard.addRule('noSpaces', (v) => !/\s/.test(v), 'Must not contain spaces');
FormGuard.addRule('hexColor', (v) => /^#[0-9A-Fa-f]{6}$/.test(v), 'Must be a valid hex color');
FormGuard.addRule('positiveInt', (v) => Number.isInteger(Number(v)) && Number(v) > 0, 'Must be a positive integer');

// Inspect a registered rule
const rule = FormGuard.getRule('hexColor');
console.log(rule.errorMessage); // 'Must be a valid hex color'

// Clear all custom rules when done
FormGuard.clearRules();
```

---

## ✏️ Custom Error Messages

Every built-in method accepts a `message` option that replaces the default error string. Use this to localise messages or match your app's tone.

```javascript
const FormGuard = require('formguard-js');

// Override email error
FormGuard.isEmail('bad', { message: 'Veuillez entrer une adresse e-mail valide' });
// { valid: false, error: 'Veuillez entrer une adresse e-mail valide' }

// Override required error
FormGuard.isRequired('', { message: 'Ce champ est obligatoire' });
// { valid: false, error: 'Ce champ est obligatoire' }

// Override password error
FormGuard.checkPassword('weak', { message: 'Votre mot de passe est trop faible' });
// { valid: false, error: 'Votre mot de passe est trop faible' }

// Override phone error
FormGuard.isPhone('123', { required: true, message: 'Numéro de téléphone invalide' });
// { valid: false, error: 'Numéro de téléphone invalide' }

// Override length error
FormGuard.checkLength('hi', { min: 5, message: 'Minimum 5 characters required' });
// { valid: false, error: 'Minimum 5 characters required' }
```

> **Note:** When a `message` override is supplied, it replaces **all** default error strings for that call — including required errors if the field is also empty. If you need different messages for different failure modes, call each method separately with its own `message`.

---

## 🌐 Browser Usage

FormGuard ships a pre-built, minified bundle at `dist/formguard.min.js`. Drop it into any HTML page via a `<script>` tag — no bundler required.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>FormGuard Browser Example</title>
</head>
<body>
  <form id="signup-form">
    <input type="email"    id="email"    placeholder="Email" />
    <input type="password" id="password" placeholder="Password" />
    <input type="tel"      id="phone"    placeholder="Phone" />
    <div id="strength"></div>
    <button type="submit">Sign Up</button>
  </form>

  <!-- Load FormGuard from your server or a CDN -->
  <script src="dist/formguard.min.js"></script>
  <script>
    // FormGuard is available as a global variable
    const form = document.getElementById('signup-form');

    // Live password strength
    document.getElementById('password').addEventListener('input', function () {
      const { strength, score } = FormGuard.passwordStrength(this.value);
      document.getElementById('strength').textContent =
        'Strength: ' + strength + ' (' + score + '/6)';
    });

    // Form submit validation
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const data = {
        email:    document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone:    document.getElementById('phone').value,
      };

      const schema = {
        email:    { required: true, type: 'email' },
        password: { required: true, type: 'password' },
        phone:    { type: 'phone' },
      };

      const { valid, errors } = FormGuard.validate(data, schema);

      if (!valid) {
        Object.entries(errors).forEach(([field, message]) => {
          console.error(field + ': ' + message);
        });
        return;
      }

      console.log('Form is valid — submitting!');
    });
  </script>
</body>
</html>
```

### Building the Browser Bundle

```bash
npm run build
# Output: dist/formguard.min.js
```

---

## 🟢 Node.js Usage

### CommonJS (`require`)

```javascript
const FormGuard = require('formguard-js');

const { valid, errors } = FormGuard.validate(
  { email: 'user@example.com', password: 'Secret@99' },
  { email: { required: true, type: 'email' }, password: { required: true, type: 'password' } }
);

console.log(valid, errors);
```

### ES Module (`import`)

```javascript
import FormGuard from 'formguard-js';

const result = FormGuard.isEmail('hello@world.io');
console.log(result); // { valid: true, error: null }
```

### Destructured Imports (if re-exported individually)

```javascript
// You can also call methods directly on the FormGuard object
const { valid, error } = FormGuard.checkPassword('MyStr0ng@Pass');
```

### Express.js Middleware Example

```javascript
const express = require('express');
const FormGuard = require('formguard-js');

const app = express();
app.use(express.json());

const registrationSchema = {
  email:    { required: true, type: 'email' },
  password: { required: true, type: 'password', minLength: 10 },
  phone:    { type: 'phone' },
};

app.post('/register', (req, res) => {
  const { valid, errors } = FormGuard.validate(req.body, registrationSchema);

  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  // Proceed with registration...
  res.json({ success: true });
});

app.listen(3000);
```

---

## 🧪 Testing

FormGuard uses Node.js's built-in test runner (no external test framework required).

```bash
npm test
```

This runs all test files in the `tests/` directory using `node --test`. You should see output similar to:

```
▶ Email Validation
  ✔ valid email passes (0.5ms)
  ✔ invalid email fails (0.2ms)
  ✔ required empty email fails (0.1ms)
  ✔ optional empty email passes (0.1ms)
▶ Email Validation (5.1ms)

▶ Password Validation
  ✔ valid password passes (0.3ms)
  ✔ too short fails (0.1ms)
  ✔ missing uppercase fails (0.1ms)
  ...
```

### Test Structure

```
tests/
├── email.test.js      — isEmail / validateEmail tests
├── password.test.js   — checkPassword / passwordStrength tests
├── phone.test.js      — isPhone / validatePhone tests
└── length.test.js     — checkLength / isRequired tests
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Write tests** for any new behaviour in `tests/`
4. **Ensure** all tests pass: `npm test`
5. **Commit** your changes: `git commit -m 'feat: add my feature'`
6. **Push** to your branch: `git push origin feature/my-feature`
7. **Open** a Pull Request

### Guidelines

- Follow the existing code style (no external dependencies, plain JavaScript)
- All new validators must return `{ valid: boolean, error: string | null }`
- All new options must be optional with sensible defaults
- Maintain 100% test coverage for new code
- Update this README if you add new public API methods

---

## 📄 License

MIT © [Ganesh (ganiya1617)](LICENSE)

- **GitHub Repository**: [https://github.com/ganiya1617/formguard-js](https://github.com/ganiya1617/formguard-js)
- **Issues & Feedback**: [https://github.com/ganiya1617/formguard-js/issues](https://github.com/ganiya1617/formguard-js/issues)
- **npm Package**: [https://www.npmjs.com/package/formguard-js](https://www.npmjs.com/package/formguard-js)

---

<p align="center">
  Made with ❤️ for developers who care about clean, validated forms.
</p>
