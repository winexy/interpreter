module.exports = {
  invalid: () => new SyntaxError('SyntaxError: Invalid or unexpected token'),
  reference: property => new ReferenceError(`ReferenceError: ${property} is not defined`),
  declare: property => new SyntaxError(`SyntaxError: Identifier ${property} has already been declared`)
};