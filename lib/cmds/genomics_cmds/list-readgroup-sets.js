'use strict';

const { post, list } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'list-readgroup-sets <datasetId>';
exports.desc = 'List readgroup sets by dataset <datasetId>.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset id.',
    type: 'string'
  }).option('page-size', {
    describe: 'Page size',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('limit', {
    describe: 'The maximum number of items to return',
    alias: 'l',
    type: 'number'
  }).option('next-page-token', {
    describe: 'Next page token',
    alias: 't',
    type: 'string'
  });
};

exports.handler = async argv => {
  if (argv.limit) {
    const response = await list(argv, `/readgroupsets/search`, {
      datasetIds: [argv.datasetId]
    }, 'readGroupSets');
    print(response, argv);
  } else {
    const response = await post(argv, `/readgroupsets/search`, {
      datasetIds: [argv.datasetId],
      pageSize: argv.pageSize,
      pageToken: argv.nextPageToken
    });
    print(response.data, argv);
  }
};
