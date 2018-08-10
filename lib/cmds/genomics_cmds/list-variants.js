'use strict';

const { post } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'list-variants <variantsetId>';
exports.desc = 'List variants by variant set ID <variantsetId>.';
exports.builder = yargs => {
  yargs.positional('variantsetId', {
    describe: 'The variant set ID.',
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
  }).option('start', {
    describe: 'The start coordinate position',
    type: 'number',
    demandOption: true
  }).option('end', {
    describe: 'The end coordinate position',
    type: 'number',
    demandOption: true
  }).option('reference', {
    describe: 'The reference to search within',
    type: 'string',
    demandOption: true
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/variants/search`, {
    variantSetIds: [argv.variantsetId],
    start: parseInt(argv.start, 10),
    end: parseInt(argv.end, 10),
    referenceName: argv.reference,
    pageSize: argv.pageSize,
    pageToken: argv.nextPageToken
  });
  print(response.data, argv);
};
