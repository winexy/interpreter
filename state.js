const errors = require('./errors');

const state = {};

function validateVariableName(name) {
  const validations = {
    startsFromDigit: name => /\d/.test(name.charAt(0)),
    containsSpace: name => /\s/.test(name),
    containsDotAfterBeggining: name => /\./.test(name.slice(1)),
    containsAmpersand: name => /&/.test(name)
  };

  return Object.values(validations).every(fn => !fn(name));
}


function _set(property, value) {
  state[property] = value;
  console.log(state);
  console.log(value);
}


module.exports = {
  get(property) {
    if (!state.hasOwnProperty(property))
      throw errors.reference(property);

    return state[property];
  },

  set(property, value) {
    if (!state.hasOwnProperty(property))
      throw errors.reference(property);

    _set(property, value);
  },

  init(property, value) {
    if (!state.hasOwnProperty(property) && !validateVariableName(property))
      throw errors.invalid();
    if (state.hasOwnProperty(property))
      throw errors.declare(property);

    _set(property, value);
  }
};





