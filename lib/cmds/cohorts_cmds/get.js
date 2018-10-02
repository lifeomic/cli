'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get <cohortId>';
exports.desc = 'Fetch cohort information by <cohortId>';
exports.builder = yargs => {
  yargs.positional('cohortId', {
    describe: 'The ID of the cohort to fetch.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/cohorts/${argv.cohortId}`);
  print(response.data, argv);
};
