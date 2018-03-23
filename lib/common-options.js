'use strict';

module.exports = function (program, command) {
  return program
    .command(command)
    .option('-a, --account <account>', 'Override the default LifeOmic account')
    .option('--json', 'Print output as JSON');
};
