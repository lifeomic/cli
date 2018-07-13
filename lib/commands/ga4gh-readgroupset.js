'use strict';

const program = require('commander');
const { get, post, del } = require('../ga4gh');
const options = require('../common-options');
const print = require('../print');

const BASE_URL = '/readgroupsets';

options(program, 'ga4gh-readgroupsets <datasetId>')
  .description('List readgroupsets')
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

options(program, 'ga4gh-readgroupsets-get <readgroupsetId>')
  .description('Fetch a readgroupset')
  .action(async (readgroupsetId, options) => {
    const response = await get(options, `${BASE_URL}/${readgroupsetId}`);
    print(response.data, options);
  });

options(program, 'ga4gh-readgroupsets-delete <readgroupsetId>')
  .description('Delete a readgroupset')
  .action(async (readgroupsetId, options) => {
    const response = await del(options, `${BASE_URL}/${readgroupsetId}`);
    print(response.data, options);
  });

options(program, 'ga4gh-readgroupsets-create <datasetId>')
  .description('Create a readgroupset')
  .option('-n,--name <name>', 'The name of the readgroupset')
  .option('-f,--file <file>', 'The ID of the BAM file to index')
  .option('-t,--type <type>', 'The sequence type:  dna, rna, aa', 'dna')
  .option('-p,--patient <patient>', 'The patient ID to reference')
  .option('-r,--reference <reference>', 'The reference build (GRCh37 or GRCh38)')
  .action(async (datasetId, options) => {
    const response = await post(options, BASE_URL, {
      datasetId: datasetId,
      fileId: options.file,
      name: options.name,
      sequenceType: options.type,
      patientId: options.patient,
      referenceSetId: options.reference
    });
    print(response.data, options);
  });

module.exports = program;
