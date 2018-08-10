'use strict';

const chalk = require('chalk');
const { del } = require('../../api');
const print = require('../../print');

exports.command = 'delete <name>';
exports.desc = 'Delete a policy by <name>';
exports.builder = yargs => {
  yargs.positional('name', {
    describe: 'The policy name.',
    type: 'string'
  });
};

exports.handler = async argv => {
  await del(argv, `/v1/policies/${argv.name}`);
  console.log(chalk.green(`Deleted policy: ${argv.name}`));
  print({ name: argv.name }, argv);
};
