'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'query-cohort <cohortId>';
exports.desc = 'Submits a cohort query to the Lifeomic analytics API.  JSON query can be read from stdin.';
exports.builder = yargs => {
  yargs.positional('cohortId', {
    describe: 'The ID of the cohort to search within.',
    type: 'string'
  }).options({
    sql: {
      describe: 'The SQL query to run',
      type: 'string',
      alias: 's'
    }
  });
};

exports.handler = async argv => {
  const contract = {
    cohort_id: argv.cohortId
  };

  if (argv.sql) {
    contract.string_query = argv.sql;
  } else {
    contract.query = await read(argv);
  }

  const response = await post(argv, `/v1/analytics/dsl`, contract);
  print(response.data, argv);
};
