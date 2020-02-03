'use strict';

const { post } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'create-readgroup-set <datasetId>';
exports.desc = 'Create readgroup genomic resources by indexing a BAM file';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('name', {
    describe: 'A friendly display name to use for the sequence resources',
    demandOption: true,
    alias: 'n',
    type: 'string'
  }).option('bam-file', {
    describe: 'The ID of the BAM file to index',
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
    type: 'string',
    demandOption: true
  }).option('indexed-date', {
    describe: 'The date the genetic test was performed.',
    type: 'string'
  }).option('performer-id', {
    describe: 'The ID of the FHIR Organization resource that performed the sequencing.',
    type: 'string'
  }).option('test-id', {
    describe: 'The ID of the test to use for grouping related genomic sets.',
    type: 'string'
  }).option('sequence-id', {
    describe: 'The ID to use for the FHIR Sequence resource.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, '/readgroupsets', {
    datasetId: argv.datasetId,
    fileId: argv.bamFile,
    name: argv.name,
    patientId: argv.patient,
    referenceSetId: argv.reference,
    sequenceType: argv.sequenceType,
    testType: argv.testType,
    indexedDate: argv.indexedDate,
    performerId: argv.performerId,
    testId: argv.testId,
    sequenceId: argv.sequenceId
  });
  print(response.data, argv);
};
