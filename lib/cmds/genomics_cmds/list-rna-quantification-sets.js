'use strict';

const { post } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'list-rna-quantification-sets <datasetId>';
exports.desc = 'List RNA quantification sets by dataset <datasetId>.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset id.',
    type: 'string'
  }).option('page-size', {
    describe: 'Number of items to return',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('next-page-token', {
    describe: 'Next page token',
    alias: 't',
    type: 'string'
  }).option('status', {
    describe: 'The status to filter results by',
    alias: 's',
    type: 'string',
    choices: ['ACTIVE', 'INDEXING', 'FAILED']
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/rnaquantificationsets/search`, {
    datasetIds: [argv.datasetId],
    pageSize: argv.pageSize,
    pageToken: argv.nextPageToken,
    status: argv.status
  });
  print(response.data, argv);
};
