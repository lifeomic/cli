'use strict';

const { post } = require('../../api');
const print = require('../../print');
const { convertToISODateString } = require('../../dateConversion');

exports.command = 'create-nantomics-vcf-import <datasetId>';
exports.desc = 'Create a task to ingest a Nantomics VCF or Fusion TSV file';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('nantomics-vcf-file', {
    describe: 'The ID of the uploaded Nantomics VCF or TSV file',
    alias: 'v',
    type: 'string',
    demandOption: true
  }).option('output-file-prefix', {
    describe: 'The prefix to use when saving the converted VCF/TSV',
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
    type: 'string',
    demandOption: true
  }).option('indexed-date', {
    describe: 'The indexed date.',
    type: 'string'
  }).option('performer-id', {
    describe: 'The ID of the FHIR Organization resource that performed the sequencing.',
    type: 'string'
  }).option('upload-type', {
    describe: 'The type of index to perform.',
    choices: ['variant', 'fnv'],
    alias: 'u',
    demandOption: false,
    type: 'string'
  }).option('re-ingest-file', {
    describe: 'Force a re-ingestion of a file that has already been ingested.',
    type: 'Boolean',
    default: false,
    demandOption: false
  }).option('body-site', {
    describe: 'The body site of the specimen.',
    type: 'string',
    demandOption: false
  }).option('body-site-system', {
    describe: 'The defining system of the provided body site.',
    type: 'string',
    demandOption: false
  }).option('body-site-display', {
    describe: 'The display field for the body-site.',
    type: 'string',
    demandOption: false
  }).option('send-failed-to', {
    describe: 'An optional email address for sending failed task notifications.',
    type: 'string',
    demandOption: false
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
    indexedDate: convertToISODateString(argv.indexedDate),
    performerId: argv.performerId,
    uploadType: argv.uploadType,
    reIngestFile: argv.reIngestFile,
    bodySite: argv.bodySite,
    bodySiteSystem: argv.bodySiteSystem,
    bodySiteDisplay: argv.bodySiteDisplay,
    sendFailedTo: argv.sendFailedTo
  });
  print(response.data, argv);
};
