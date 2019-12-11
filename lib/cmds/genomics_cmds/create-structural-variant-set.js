'use strict';

const { post } = require('../../ga4gh');
const print = require('../../print');
const { convertToISODateString } = require('../../dateConversion');

exports.command = 'create-structural-variant-set <datasetId>';
exports.desc = 'Create structural variant genomic resources by indexing a FNV file';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('name', {
    describe: 'A friendly display name to use for the sequence resources',
    demandOption: true,
    alias: 'n',
    type: 'string'
  }).option('fnv-file', {
    describe: 'The ID of the FNV file to index',
    alias: 'f',
    type: 'string',
    demandOption: true
  }).option('patient', {
    describe: 'The patient ID to reference',
    alias: 'p',
    type: 'string',
    demandOption: true
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
    type: 'string',
    demandOption: true
  }).option('test-type', {
    describe: 'The genetic test type.',
    type: 'string'
  }).option('indexed-date', {
    describe: 'The date the genetic test was performed.',
    type: 'string'
  }).option('performer-id', {
    describe: 'The ID of the FHIR Organization resource that performed the sequencing.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, '/fusionsets', {
    datasetId: argv.datasetId,
    fileId: argv.fnvFile,
    name: argv.name,
    patientId: argv.patient,
    referenceSetId: argv.reference,
    sequenceType: argv.sequenceType,
    testType: argv.testType,
    indexedDate: convertToISODateString(argv.indexedDate),
    performerId: argv.performerId
  });
  print(response.data, argv);
};
