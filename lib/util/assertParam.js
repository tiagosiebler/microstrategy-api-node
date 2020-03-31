const assert = require('assert');

module.exports = (object, key) => {
  if (!key) {
    return assert(object, 'No params passed');
  }
  return assert(object[key], `Parameter ${key} is required`);
}