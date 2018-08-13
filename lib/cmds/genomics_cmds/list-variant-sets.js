'use strict';

const { post } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'list-variant-sets <datasetId>';
exports.desc = 'List variant sets by dataset <datasetId>.';
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
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/variantsets/search`, {
    datasetIds: [argv.datasetId],
    pageSize: argv.pageSize,
    pageToken: argv.nextPageToken
  });
  print(response.data, argv);
};
