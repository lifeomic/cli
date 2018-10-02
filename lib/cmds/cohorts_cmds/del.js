'use strict';

const chalk = require('chalk');
const { del } = require('../../api');

exports.command = 'delete <cohortId>';
exports.desc = 'Delete a cohort by <cohortId>';
exports.builder = yargs => {
  yargs.positional('cohortId', {
    describe: 'The ID of the cohort to delete.',
    type: 'string'
  });
};

exports.handler = async argv => {
  await del(argv, `/v1/cohorts/${argv.cohortId}`);
  console.log(chalk.green(`Deleted cohort: ${argv.cohortId}`));
};
