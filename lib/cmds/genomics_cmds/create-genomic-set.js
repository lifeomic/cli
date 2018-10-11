'use strict';

const { post } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'create-genomic-set <datasetId>';
exports.desc = 'Create genomic resources by indexing a VCF and/or BAM';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('name', {
    describe: 'The resource name',
    demandOption: true,
    alias: 'n',
    type: 'string'
  }).option('variants-file', {
    describe: 'The ID of the VCF file to index',
    alias: 'v',
    type: 'string'
  }).option('bam-file', {
    describe: 'The ID of the BAM file to index',
    alias: 'b',
    type: 'string'
  }).option('patient', {
    describe: 'The patient ID to reference',
    alias: 'p',
    type: 'string'
  }).option('reference', {
    demandOption: true,
    choices: ['GRCh37', 'GRCh38'],
    describe: 'The reference build',
    alias: 'r',
    type: 'string'
  }).option('sequence-type', {
    choices: ['germline', 'somatic', 'metastatic', 'ctDNA', 'rna'],
    describe: 'The sequence type',
    alias: 't',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, '/genomicsets', {
    datasetId: argv.datasetId,
    variantsFileId: argv.variantsFile,
    readsFileId: argv.bamFile,
    name: argv.name,
    patientId: argv.patient,
    referenceSetId: argv.reference,
    sequenceType: argv.sequenceType
  });
  print(response.data, argv);
};
