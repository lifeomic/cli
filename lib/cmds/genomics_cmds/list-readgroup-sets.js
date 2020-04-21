'use strict';

const { post, list } = require('../../ga4gh');
const print = require('../../print');
const genomicFilter = require('../../genomic-filter');

exports.command = 'list-readgroup-sets <datasetId>';
exports.desc = 'List readgroup sets by dataset <datasetId>.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset id.',
    type: 'string'
  }).option('page-size', {
    describe: 'Page size, limit max of 1000',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('limit', {
    describe: 'The maximum number of items to return, will override page size',
    alias: 'l',
    type: 'number'
  }).option('next-page-token', {
    describe: 'Next page token',
    alias: 't',
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
  if (argv.limit) {
    const response = await list(argv, `/readgroupsets/search`, {
      datasetIds: [argv.datasetId]
    }, 'readGroupSets');
    response.readGroupSets = await genomicFilter(response.readGroupSets, argv);
    print(response.readGroupSets, argv);
  } else {
    const response = await post(argv, `/readgroupsets/search`, {
      datasetIds: [argv.datasetId],
      pageSize: argv.pageSize,
      pageToken: argv.nextPageToken
    });
    response.data.readGroupSets = await genomicFilter(response.data.readGroupSets, argv);
    print(response.data, argv);
  }
};
