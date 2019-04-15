'use strict';

const { post, list } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'list-variant-sets <datasetId>';
exports.desc = 'List variant sets by dataset <datasetId>.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset id.',
    type: 'string'
  }).option('page-size', {
    describe: 'Page size',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('next-page-token', {
    describe: 'Next page token',
    alias: 't',
    type: 'string'
  }).option('limit', {
    describe: 'The maximum number of items to return',
    alias: 'l',
    type: 'number'
  }).option('status', {
    describe: 'The status to filter results by',
    alias: 's',
    type: 'string',
    choices: ['ACTIVE', 'INDEXING', 'FAILED']
  });
};

exports.handler = async argv => {
  if (argv.limit) {
    const response = await list(argv, `/variantsets/search`, {
      datasetIds: [argv.datasetId],
      status: argv.status
    }, 'variantSets');
    print(response, argv);
  } else {
    const response = await post(argv, `/variantsets/search`, {
      datasetIds: [argv.datasetId],
      pageSize: argv.pageSize,
      pageToken: argv.nextPageToken,
      status: argv.status
    });
    print(response.data, argv);
  }
};
