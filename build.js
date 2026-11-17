'use strict';

/**
 * build.js — Generates dist/formguard.min.js as a UMD browser bundle.
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const DIST_FILE = path.join(DIST_DIR, 'formguard.min.js');

// Ensure dist/ exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

/**
 * Strip require() calls and module.exports lines from a module's source.
 * Returns cleaned-up function/logic code.
 */
function extractLogic(src) {
  return src
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith("'use strict'")) return false;
      if (trimmed.startsWith('"use strict"')) return false;
      if (trimmed.startsWith('const ') && trimmed.includes('require(')) return false;
      if (trimmed.startsWith('module.exports')) return false;
      return true;
    })
    .join('\n');
}

const moduleOrder = ['email', 'password', 'phone', 'required', 'length', 'custom', 'validator'];

let inlinedModules = '';
for (const mod of moduleOrder) {
  const filePath = path.join(SRC_DIR, `${mod}.js`);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing src/${mod}.js`);
    process.exit(1);
  }
  const src = fs.readFileSync(filePath, 'utf8');
  const logic = extractLogic(src);
  inlinedModules += `\n  // === ${mod} module ===\n${logic}\n`;
}

const umd = `(function(root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.FormGuard = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';
${inlinedModules}
  // === FormGuard public API ===
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

  return FormGuard;
});
`;

fs.writeFileSync(DIST_FILE, umd, 'utf8');
console.log(`✅ Built dist/formguard.min.js (${umd.length} bytes)`);
