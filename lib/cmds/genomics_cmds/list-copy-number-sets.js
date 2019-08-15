'use strict';

const { post, list } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'list-copy-number-sets <datasetId>';
exports.desc = 'List copy number sets by dataset <datasetId>.';
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
  }).option('sequenceId', {
    describe: 'The sequence to filter results by',
    alias: 'q',
    type: 'string'
  }).option('patientId', {
    describe: 'The patient to filter results by',
    alias: 'p',
    type: 'string'
  });
};

exports.handler = async argv => {
  const body = {
    datasetIds: [argv.datasetId]
  };

  if (argv.status) {
    body.status = argv.status;
  }

  if (argv.patientId) {
    body.patientId = argv.patientId;
  }

  if (argv.sequenceId) {
    body.sequenceId = argv.sequenceId;
  }

  if (argv.limit) {
    const response = await list(argv, `/copynumbersets/search`, body, 'copyNumberSets');
    print(response, argv);
  } else {
    body.pageSize = argv.pageSize;
    body.pageToken = argv.nextPageToken;
    const response = await post(argv, `/copynumbersets/search`, body);
    print(response.data, argv);
  }
};
