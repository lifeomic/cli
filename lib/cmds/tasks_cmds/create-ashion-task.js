'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create-ashion-import <datasetId>';
exports.desc = 'Create a task to ingest a Ashion TAR file';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('tar-file-id', {
    describe: 'The ID of the uploaded Ashion TAR file',
    alias: 'f',
    type: 'string',
    demandOption: true
  }).option('subject-id', {
    describe: 'The ID of the subject to associated the report with',
    alias: 's',
    type: 'string',
    demandOption: true
  }).option('indexed-date', {
    describe: 'The indexed date.',
    type: 'string'
  }).option('performer-id', {
    describe: 'The ID of the FHIR Organization resource that performed the sequencing.',
    type: 'string'
  }).option('output-prefix', {
    describe: 'A prefix to put at the front of the output file names.',
    type: 'string',
    demandOption: false
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/tasks/system/ashion-import`, {
    tarFileId: argv.tarFileId,
    datasetId: argv.datasetId,
    subjectId: argv.subjectId,
    indexedDate: argv.indexedDate,
    performerId: argv.performerId,
    outputFilePrefix: argv.outputPrefix
  });
  print(response.data, argv);
};
