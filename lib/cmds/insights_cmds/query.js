'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'query <datasetId>';
exports.desc = 'Submits query to the Lifeomic analytics API.  JSON query can be read from stdin.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The ID of the project to search within.',
    type: 'string'
  }).options({
    cohortId: {
      describe: 'The ID of the cohort to search within.',
      type: 'string'
    },
    sql: {
      describe: 'The SQL query to run',
      type: 'string',
      alias: 's'
    }
  });
};

exports.handler = async argv => {
  const { datasetId, cohortId } = argv;

  let contract;
  if (cohortId) {
    contract = {
      cohort_id: cohortId
    };
  } else {
    contract = {
      dataset_id: datasetId
    };
  }

  if (argv.sql) {
    contract.string_query = argv.sql;
  } else {
    contract.query = await read(argv);
  }

  const response = await post(argv, `/v1/analytics/dsl`, contract);
  print(response.data, argv);
};
