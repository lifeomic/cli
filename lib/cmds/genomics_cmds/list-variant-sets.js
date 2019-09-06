'use strict';

const { post, list } = require('../../ga4gh');
const print = require('../../print');
const genomicFilter = require('../../genomic-filter');

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
  }).option('sequenceId', {
    describe: 'The sequence to filter results by',
    alias: 'q',
    type: 'string'
  }).option('patientId', {
    describe: 'The patient to filter results by',
    alias: 'p',
    type: 'string'
  }).option('missing-patient', {
    describe: 'Only return records missing patientIds',
    type: 'Boolean',
    default: false,
    demandOption: false
  }).option('missing-sequence', {
    describe: 'Only return records missing sequenceIds',
    type: 'Boolean',
    default: false,
    demandOption: false
  }).option('missing-samples', {
    describe: 'Only return records missing sample names',
    type: 'Boolean',
    default: false,
    demandOption: false
  }).option('missing-fhir-sequence', {
    describe: 'Only return records missing fhir sequences',
    type: 'Boolean',
    default: false,
    demandOption: false
  }).option('only-ids', {
    describe: 'Only returns the ids of the records, useful for generating data sources for scripts',
    type: 'Boolean',
    default: false,
    demandOption: false
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
    const response = await list(argv, `/variantsets/search`, body, 'variantSets');
    response.data.variantSets = await genomicFilter(response.data.variantSets, argv);
    print(response, argv);
  } else {
    body.pageSize = argv.pageSize;
    body.pageToken = argv.nextPageToken;
    const response = await post(argv, `/variantsets/search`, body);
    response.data.variantSets = await genomicFilter(response.data.variantSets, argv);
    print(response.data, argv);
  }
};
