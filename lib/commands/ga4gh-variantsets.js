'use strict';

const program = require('commander');
const { get, post, del } = require('../ga4gh');
const options = require('../common-options');
const print = require('../print');

const BASE_URL = '/variantsets';

options(program, 'ga4gh-variantsets <datasetId>')
  .description('List variantsets')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (datasetId, options) => {
    const response = await post(options, `${BASE_URL}/search`, {
      datasetIds: [datasetId],
      pageSize: options.pageSize,
      pageToken: options.nextPageToken
    });
    print(response.data, options);
  });

options(program, 'ga4gh-variantsets-get <variantsetId>')
  .description('Fetch a variantset')
  .action(async (variantsetId, options) => {
    const response = await get(options, `${BASE_URL}/${variantsetId}`);
    print(response.data, options);
  });

options(program, 'ga4gh-variantsets-delete <variantsetId>')
  .description('Delete a variantset')
  .action(async (variantsetId, options) => {
    const response = await del(options, `${BASE_URL}/${variantsetId}`);
    print(response.data, options);
  });

options(program, 'ga4gh-variantsets-create <datasetId>')
  .description('Create a variantset')
  .option('-n,--name <name>', 'The name of the variantset')
  .option('-f,--file <file>', 'The ID of the VCF file to index')
  .option('-p,--patient <patient>', 'The patient ID to reference')
  .option('-r,--reference <reference>', 'The reference build (GRCh37 or GRCh38)')
  .action(async (datasetId, options) => {
    const response = await post(options, BASE_URL, {
      datasetId: datasetId,
      fileId: options.file,
      name: options.name,
      patientId: options.patient,
      referenceSetId: options.reference
    });
    print(response.data, options);
  });

module.exports = program;
