'use strict';

module.exports = (yargs) => {
  return yargs
    .option('json', {
      describe: 'List output as JSON',
      type: 'boolean'
    }).option('account', {
      describe: 'Override the account',
      type: 'string'
    });
};
