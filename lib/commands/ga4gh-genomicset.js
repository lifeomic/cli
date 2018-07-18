'use strict';

const program = require('commander');
const { post } = require('../ga4gh');
const options = require('../common-options');
const print = require('../print');

const BASE_URL = '/genomicsets';

options(program, 'ga4gh-genomicsets-create <datasetId>')
  .description('Create a genomic set by indexing a VCF and/or BAM')
  .option('-n,--name <name>', 'The name of the genomic set')
  .option('-v,--variantsFile <variantsFile>', 'The ID of the VCF file to index')
  .option('-b,--bamFile <bamFile>', 'The ID of the BAM file to index')
  .option('-p,--patient <patient>', 'The patient ID to reference')
  .option('-r,--reference <reference>', 'The reference build (GRCh37 or GRCh38)')
  .action(async (datasetId, options) => {
    const response = await post(options, BASE_URL, {
      datasetId: datasetId,
      variantsFileId: options.variantsFile,
      readsFileId: options.bamFile,
      name: options.name,
      patientId: options.patient,
      referenceSetId: options.reference
    });
    print(response.data, options);
  });

module.exports = program;
