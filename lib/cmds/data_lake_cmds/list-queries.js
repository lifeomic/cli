'use strict';

const { list } = require('../../api');
const print = require('../../print');
const querystring = require('querystring');

exports.command = 'list-queries <projectId>';
exports.desc = 'List the query executions in the project.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to fetch queries of.',
    type: 'string'
  }).option('page-size', {
    alias: 'n',
    type: 'number',
    default: 25,
    describe: 'Maximum number of queries to return.'
  }).option('next-page-token', {
    alias: 't',
    type: 'string',
    describe: 'Token to retrieve the next page of results'
  });
};

exports.handler = async argv => {
  const query = {
    datasetId: argv.projectId,
    pageSize: argv.pageSize
  };

  if (argv.nextPageToken) {
    query.nextPageToken = argv.nextPageToken;
  }

  const response = await list(argv, `/v1/analytics/data-lake/query?${querystring.stringify(query)}`);
  print(response.data, argv);
};
