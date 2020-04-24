const errors = require('./errors');
const state = require('./state');
const keywords = require('./keywords');

exports.parseInput = function (input) {
  input = input.trim();

  let [first, second, ...rest] = input.split(/\s+/);

  rest = rest.join(' ').replace(/'/g, '');

  return [first, second, rest];
};


exports.perform = function (params) {
  let [first, second, third] = params;

  first = first.toUpperCase();
  second = second.toUpperCase();

  if (second in keywords.define)
    performAssignment(first, third);
  else if (first in keywords.action)
    performMoveOperation(first, second, third);
  else if (first in keywords.math)
    performMathOperation(first, second, third);
  else if (first in keywords.unary)
    performUnaryOperation(first, second);
  else throw errors.invalid();
};


function performAssignment(variable, value) {
  if (!Number.isNaN(+value)) {
    value = +value;
  }

  state.init(variable, value);
}

function performMoveOperation(operation, ...variables) {
  variables = variables.map(sanitize);
  let [destination, source] = variables;

  if (operation === keywords.codes.MOV) {
    state.set(destination, state.get(source));
  } else if (operation === keywords.codes.XCHG) {
    let temp = state.get(destination);
    state.set(destination, state.get(source));
    state.set(source, temp);
  }
}

function performMathOperation(operation, ...variables) {
  variables = variables.map(sanitize);
  let [first, second] = variables;
  let newValue;

  let firstValue = state.get(first);
  let radix1 = getRadix(firstValue);
  let convertedValue1 = convert(firstValue, radix1);

  let secondValue = state.get(second);
  let radix2 = getRadix(secondValue);
  let convertedValue2 = convert(secondValue, radix2);

  if (operation === keywords.codes.ADD) {
    newValue = convertedValue2 + convertedValue1;
  } else if (operation === keywords.codes.SUB) {
    newValue = convertedValue2 - convertedValue1;
  } else if (operation === keywords.codes.MUL) {
    newValue = convertedValue2 * convertedValue1;
  } else if (operation === keywords.codes.DIV) {
    newValue = convertedValue2 / convertedValue1;
  }

  let postfix = convertRadix(radix1);
  newValue = convert(newValue, radix1, postfix);

  state.set(first, newValue);
}

function performUnaryOperation(operation, variable) {
  let value = state.get(variable);
  let newValue;

  let radix = getRadix(value);
  let convertedValue = convert(value, radix);

  if (operation === keywords.codes.INC) {
    newValue = convertedValue + 1;
  } else if (operation === keywords.codes.DEC) {
    newValue = convertedValue - 1;
  }

  let postfix = convertRadix(radix);
  convertedValue = convert(newValue, radix, postfix);

  state.set(variable, convertedValue);
}


function sanitize(variable) {
  return variable.replace(',', '').toUpperCase();
}


function convert(number, radix, postfix) {
  if (postfix) {
    return number.toString(radix) + postfix;
  } else {
    return parseInt(number, radix);
  }
}


function getRadix(number) {
  let radix;
  if (typeof number === 'string')
    radix = number.charAt(number.length - 1);
  return {h: 16, d: 10, b: 2}[radix] || 10;
}

function convertRadix(radix) {
  return {
    16: 'h',
    10: 'd',
    2: 'b'
  }[radix] || '';
}
