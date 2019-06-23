'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'query-dataset <datasetId>';
exports.desc = 'Submits a dataset query to the Lifeomic analytics API.  JSON query can be read from stdin.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The ID of the dataset to search within.',
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
    dataset_id: argv.datasetId
  };

  if (argv.sql) {
    contract.string_query = argv.sql;
  } else {
    contract.query = await read(argv);
  }

  const response = await post(argv, `/v1/analytics/dsl`, contract);
  print(response.data, argv);
};
