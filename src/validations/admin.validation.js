const validator = require('validator');

const validateRegister = (name, email, password) => {
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  return errors;
};

const validateLogin = (email, password) => {
  const errors = [];
  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }
  if (!password) {
    errors.push('Password is required');
  }
  return errors;
};

module.exports = { validateRegister, validateLogin };
