'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create-nantomics-vcf-import <datasetId>';
exports.desc = 'Create a task to ingest a Nantomics VCF';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('nantomics-vcf-file', {
    describe: 'The ID of the uploaded Nantomics VCF',
    alias: 'v',
    type: 'string',
    demandOption: true
  }).option('output-file-prefix', {
    describe: 'The prefix to use when saving the converted VCF',
    alias: 'p',
    type: 'string',
    demandOption: true
  }).option('sequence-type', {
    describe: 'The type of sequence',
    alias: 'e',
    choices: ['germline', 'somatic'],
    type: 'string',
    demandOption: true
  }).option('subject-id', {
    describe: 'The ID of the subject to associated the report with',
    alias: 's',
    type: 'string',
    demandOption: true
  }).option('sequence-name', {
    describe: 'A friendly display name for the sequencing event.',
    alias: 'n',
    type: 'string'
  }).option('test-type', {
    describe: 'The test type.',
    type: 'string'
  }).option('performer-id', {
    describe: 'The ID of the FHIR Organization resource that performed the seqeuncing.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/tasks/system/nantomics-vcf-import`, {
    nantomicsVcfFileId: argv.nantomicsVcfFile,
    datasetId: argv.datasetId,
    outputFilePrefix: argv.outputFilePrefix,
    subjectId: argv.subjectId,
    sequenceType: argv.sequenceType,
    sequenceName: argv.sequenceName,
    testType: argv.testType,
    performerId: argv.performerId
  });
  print(response.data, argv);
};
