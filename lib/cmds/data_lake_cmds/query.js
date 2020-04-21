'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'query <projectId>';
exports.desc = 'Submits a query to the Lifeomic data-lake API. A SQL query string can also be read from stdin.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to search within.',
    type: 'string'
  }).option('query', {
    alias: 'q',
    type: 'string',
    describe: 'The SQL query to run.'
  }).option('output-file-name', {
    alias: 'o',
    type: 'string',
    describe: 'Name of the results file.',
    demandOption: true
  });
};

exports.handler = async argv => {
  const request = {
    outputFileName: argv.outputFileName,
    datasetId: argv.projectId
  };

  if (argv.query) {
    request.query = argv.query;
  } else {
    request.query = await read(argv);
  }

  const response = await post(argv, '/v1/analytics/data-lake/query', request);
  print(response.data, argv);
};
