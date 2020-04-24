const repl = require('repl');
const core = require('./core');


module.exports = () => repl.start({
  prompt: '> ',
  eval(input) {
    try {
      let parsedInput = core.parseInput(input);
      console.log(parsedInput);
      core.perform(parsedInput);
    } catch(error) {
      console.error(error.message);
    }
  }
});





