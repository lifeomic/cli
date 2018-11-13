'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create-foundation-xml-import <datasetId>';
exports.desc = 'Create a task to ingest a Foundation One XML report';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('xml-file-id', {
    describe: 'The ID of the uploaded Foundation One XML report',
    alias: 'x',
    type: 'string',
    demandOption: true
  }).option('report-file-id', {
    describe: 'The file ID of the PDF report. Only use if uploading the PDF separately.',
    alias: 'r',
    type: 'string',
    demandOption: false
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
  const response = await post(argv, `/v1/tasks/system/foundation-xml-import`, {
    xmlFileId: argv.xmlFileId,
    datasetId: argv.datasetId,
    reportFileId: argv.reportFileId,
    subjectId: argv.subjectId,
    sequenceName: argv.sequenceName,
    testType: argv.testType,
    performerId: argv.performerId
  });
  print(response.data, argv);
};
