const validator = require('validator');

const validateContact = (body) => {
  const { name, email, message } = body;
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }
  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  if (body.message && body.message.length > 2000) {
    errors.push('Message cannot exceed 2000 characters');
  }
  return errors;
};

module.exports = { validateContact };
