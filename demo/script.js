/**
 * FormGuard Demo Application
 * Interactively demonstrates the FormGuard validation library in the browser.
 */

(function () {
  'use strict';

  // Ensure FormGuard is loaded
  if (typeof FormGuard === 'undefined') {
    console.error('FormGuard library not found! Ensure dist/formguard.min.js is loaded.');
    return;
  }

  // --- Element Selectors ---
  var form = document.getElementById('demo-form');
  var formSuccess = document.getElementById('form-success');

  var fName = document.getElementById('f-name');
  var fEmail = document.getElementById('f-email');
  var fPassword = document.getElementById('f-password');
  var fConfirm = document.getElementById('f-confirm');
  var fPhone = document.getElementById('f-phone');

  var errName = document.getElementById('err-name');
  var errEmail = document.getElementById('err-email');
  var errPassword = document.getElementById('err-password');
  var errConfirm = document.getElementById('err-confirm');
  var errPhone = document.getElementById('err-phone');

  // Strength meter elements
  var strengthMeter = document.getElementById('strength-meter');
  var seg1 = document.getElementById('seg-1');
  var seg2 = document.getElementById('seg-2');
  var seg3 = document.getElementById('seg-3');
  var strengthLabel = document.getElementById('strength-label');

  var reqLength = document.getElementById('req-length');
  var reqUpper = document.getElementById('req-upper');
  var reqLower = document.getElementById('req-lower');
  var reqNumber = document.getElementById('req-number');
  var reqSpecial = document.getElementById('req-special');

  // Track if fields have been interacted with
  var touched = {
    name: false,
    email: false,
    password: false,
    confirm: false,
    phone: false
  };

  // Helper: set field state
  function setFieldState(inputEl, errorEl, isValid, errorMessage) {
    if (isValid) {
      inputEl.classList.remove('error');
      inputEl.classList.add('success');
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    } else {
      inputEl.classList.remove('success');
      inputEl.classList.add('error');
      errorEl.textContent = errorMessage || 'Invalid value';
      errorEl.style.display = 'block';
    }
  }

  function clearFieldState(inputEl, errorEl) {
    inputEl.classList.remove('error', 'success');
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }

  // Individual validators using real FormGuard API
  function validateNameField(showError) {
    var val = fName.value.trim();
    if (!val && !showError) {
      clearFieldState(fName, errName);
      return false;
    }
    var reqRes = FormGuard.isRequired(val, { message: 'Full name is required' });
    if (!reqRes.valid) {
      if (showError) setFieldState(fName, errName, false, reqRes.error);
      return false;
    }
    var lenRes = FormGuard.checkLength(val, { min: 2, max: 50, message: 'Name must be between 2 and 50 characters' });
    if (!lenRes.valid) {
      if (showError) setFieldState(fName, errName, false, lenRes.error);
      return false;
    }
    setFieldState(fName, errName, true);
    return true;
  }

  function validateEmailField(showError) {
    var val = fEmail.value.trim();
    if (!val && !showError) {
      clearFieldState(fEmail, errEmail);
      return false;
    }
    var res = FormGuard.isEmail(val, { required: true });
    if (!res.valid) {
      if (showError) setFieldState(fEmail, errEmail, false, res.error);
      return false;
    }
    setFieldState(fEmail, errEmail, true);
    return true;
  }

  function updatePasswordMeter(val) {
    if (!val) {
      strengthMeter.classList.remove('visible');
      seg1.className = 'strength-segment';
      seg2.className = 'strength-segment';
      seg3.className = 'strength-segment';
      strengthLabel.textContent = 'Type a password';
      strengthLabel.className = 'strength-label';

      var pills = [reqLength, reqUpper, reqLower, reqNumber, reqSpecial];
      pills.forEach(function (pill) {
        if (pill) {
          pill.classList.remove('met');
          var icon = pill.querySelector('.req-icon');
          if (icon) icon.textContent = '✕';
        }
      });
      return;
    }

    strengthMeter.classList.add('visible');
    var strResult = FormGuard.passwordStrength(val);

    // Update requirements pills
    var checks = strResult.checks || {};
    var updatePill = function (el, passed) {
      if (!el) return;
      var icon = el.querySelector('.req-icon');
      if (passed) {
        el.classList.add('met');
        if (icon) icon.textContent = '✓';
      } else {
        el.classList.remove('met');
        if (icon) icon.textContent = '✕';
      }
    };

    updatePill(reqLength, checks.minLength);
    updatePill(reqUpper, checks.uppercase);
    updatePill(reqLower, checks.lowercase);
    updatePill(reqNumber, checks.number);
    updatePill(reqSpecial, checks.specialCharacter);

    // Update segments and label
    seg1.className = 'strength-segment';
    seg2.className = 'strength-segment';
    seg3.className = 'strength-segment';
    strengthLabel.className = 'strength-label';

    if (strResult.strength === 'Strong') {
      seg1.classList.add('active-strong');
      seg2.classList.add('active-strong');
      seg3.classList.add('active-strong');
      strengthLabel.textContent = 'Strong Password (' + strResult.score + '/6)';
      strengthLabel.classList.add('strong');
    } else if (strResult.strength === 'Medium') {
      seg1.classList.add('active-medium');
      seg2.classList.add('active-medium');
      strengthLabel.textContent = 'Medium Password (' + strResult.score + '/6)';
      strengthLabel.classList.add('medium');
    } else {
      seg1.classList.add('active-weak');
      strengthLabel.textContent = 'Weak Password (' + strResult.score + '/6)';
      strengthLabel.classList.add('weak');
    }
  }

  function validatePasswordField(showError) {
    var val = fPassword.value;
    updatePasswordMeter(val);

    if (!val && !showError) {
      clearFieldState(fPassword, errPassword);
      return false;
    }
    var res = FormGuard.checkPassword(val, { required: true, minLength: 8 });
    if (!res.valid) {
      if (showError) setFieldState(fPassword, errPassword, false, res.error);
      return false;
    }
    setFieldState(fPassword, errPassword, true);
    return true;
  }

  function validateConfirmField(showError) {
    var pVal = fPassword.value;
    var cVal = fConfirm.value;

    if (!cVal && !showError) {
      clearFieldState(fConfirm, errConfirm);
      return false;
    }

    if (!cVal) {
      if (showError) setFieldState(fConfirm, errConfirm, false, 'Please confirm your password');
      return false;
    }

    if (pVal !== cVal) {
      if (showError) setFieldState(fConfirm, errConfirm, false, 'Passwords do not match');
      return false;
    }

    setFieldState(fConfirm, errConfirm, true);
    return true;
  }

  function validatePhoneField(showError) {
    var val = fPhone.value.trim();
    if (!val && !showError) {
      clearFieldState(fPhone, errPhone);
      return false;
    }
    var res = FormGuard.isPhone(val, { required: true, country: 'IN', allowCountryCode: true });
    if (!res.valid) {
      if (showError) setFieldState(fPhone, errPhone, false, res.error);
      return false;
    }
    setFieldState(fPhone, errPhone, true);
    return true;
  }

  // --- Real-time Event Listeners ---
  fName.addEventListener('input', function () {
    validateNameField(touched.name);
  });
  fName.addEventListener('blur', function () {
    touched.name = true;
    validateNameField(true);
  });

  fEmail.addEventListener('input', function () {
    validateEmailField(touched.email);
  });
  fEmail.addEventListener('blur', function () {
    touched.email = true;
    validateEmailField(true);
  });

  fPassword.addEventListener('input', function () {
    validatePasswordField(touched.password);
    if (touched.confirm && fConfirm.value) {
      validateConfirmField(true);
    }
  });
  fPassword.addEventListener('blur', function () {
    touched.password = true;
    validatePasswordField(true);
  });

  fConfirm.addEventListener('input', function () {
    validateConfirmField(touched.confirm);
  });
  fConfirm.addEventListener('blur', function () {
    touched.confirm = true;
    validateConfirmField(true);
  });

  fPhone.addEventListener('input', function () {
    validatePhoneField(touched.phone);
  });
  fPhone.addEventListener('blur', function () {
    touched.phone = true;
    validatePhoneField(true);
  });

  // --- Form Submission ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Mark all as touched
    touched.name = true;
    touched.email = true;
    touched.password = true;
    touched.confirm = true;
    touched.phone = true;

    // Validate all fields
    var vName = validateNameField(true);
    var vEmail = validateEmailField(true);
    var vPassword = validatePasswordField(true);
    var vConfirm = validateConfirmField(true);
    var vPhone = validatePhoneField(true);

    var isAllValid = vName && vEmail && vPassword && vConfirm && vPhone;

    if (isAllValid) {
      formSuccess.classList.add('visible');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Automatically hide after 6 seconds
      setTimeout(function () {
        formSuccess.classList.remove('visible');
      }, 6000);
    } else {
      formSuccess.classList.remove('visible');

      // Focus first erroneous input
      if (!vName) fName.focus();
      else if (!vEmail) fEmail.focus();
      else if (!vPassword) fPassword.focus();
      else if (!vConfirm) fConfirm.focus();
      else if (!vPhone) fPhone.focus();
    }
  });

  // --- Navbar Scroll Effect ---
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();

// --- Global helper functions called directly from HTML inline handlers ---

// Password visibility toggle
function togglePassword(inputId, btn) {
  var input = document.getElementById(inputId);
  if (!input) return;

  var isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  if (isPassword) {
    // Show slash through eye
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
  } else {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
}

// Copy install command
function copyInstall() {
  var cmd = 'npm install @ganiya1617/formguard-js';
  navigator.clipboard.writeText(cmd).then(function () {
    var btn = document.querySelector('.install-block .copy-btn span');
    if (btn) {
      var original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function () {
        btn.textContent = original;
      }, 2000);
    }
  }).catch(function (err) {
    console.error('Copy failed', err);
  });
}

// Code tabs switcher
function switchTab(index) {
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(function (btn, i) {
    if (i === index) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  tabPanels.forEach(function (panel, i) {
    if (i === index) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

// Copy code snippets
function copyCode(index) {
  var codeEl = document.getElementById('code-' + index);
  if (!codeEl) return;

  var text = codeEl.innerText || codeEl.textContent;
  navigator.clipboard.writeText(text).then(function () {
    var btn = document.querySelectorAll('.copy-code-btn')[index];
    if (btn) {
      var span = btn.querySelector('span');
      if (span) {
        var orig = span.textContent;
        span.textContent = 'Copied!';
        setTimeout(function () {
          span.textContent = orig;
        }, 2000);
      }
    }
  }).catch(function (err) {
    console.error('Failed to copy code', err);
  });
}
