'use strict';

const { list } = require('../../api');
const print = require('../../print');
const querystring = require('querystring');

exports.command = 'list-jobs';
exports.desc = 'List the Insights indexing jobs currently scheduled.';
exports.builder = yargs => {
  yargs.option('page-size', {
    alias: 'n',
    type: 'number',
    default: 25,
    describe: 'Maximum number of jobs to return.'
  }).option('next-page-token', {
    alias: 't',
    type: 'string',
    describe: 'Token to retrieve the next page of results'
  });
};

exports.handler = async argv => {
  const query = {
    pageSize: argv.pageSize
  };

  if (argv.nextPageToken) {
    query.nextPageToken = argv.nextPageToken;
  }

  const response = await list(argv, `/v1/analytics/jobs?${querystring.stringify(query)}`);
  print(response.data, argv);
};
