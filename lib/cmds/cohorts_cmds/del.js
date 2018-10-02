'use strict';

const { del } = require('../../api');
const print = require('../../print');

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
  print(`Deleted cohort: ${argv.cohortId}`, argv);
};
