const slugify = require('slugify');

/**
 * Generate URL-friendly slug from text
 * @param {string} text
 * @returns {string}
 */
const generateSlug = (text) => {
  if (!text || typeof text !== 'string') return '';
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

module.exports = { generateSlug };
