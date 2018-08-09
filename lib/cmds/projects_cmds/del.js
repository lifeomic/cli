'use strict';

const chalk = require('chalk');
const { del } = require('../../api');

exports.command = 'delete <projectId>';
exports.desc = 'Delete a by <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to delete.',
    type: 'string'
  });
};

exports.handler = async argv => {
  await del(argv, `/v1/projects/${argv.projectId}`);
  console.log(chalk.green(`Deleted project: ${argv.projectId}`));
};
