'use strict';

const { post } = require('../../../api');
const print = require('../../../print');

exports.command = 'create-foundation <projectId> <xmlFileId> <reportFileId> [vcfFileId]';
exports.desc = 'Create Foundation ingestion for <xmlFileId>, <reportFileId>, and optionally [vcfFileId] in <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('xmlFileId', {
    describe: 'The ID of the XML file.',
    type: 'string'
  }).positional('reportFileId', {
    describe: 'The ID of the report file.',
    type: 'string'
  }).positional('vcfFileId', {
    describe: 'The ID of the VCF file.',
    type: 'string'
  }).option('succeededEmail', {
    describe: 'An email address to notify if the ingestion succeeds',
    type: 'string'
  }).option('failedEmail', {
    describe: 'An email address to notify if the ingestion fails',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/genomic-ingestion/projects/${argv.projectId}/ingestions`, {
    ingestionType: 'Foundation',
    inputFiles: {
      xml: argv.xmlFileId,
      vcf: argv.vcfFileId || null,
      report: argv.reportFileId
    },
    notificationConfig: {
      succeededEmail: argv.succeededEmail,
      failedEmail: argv.failedEmail
    }
  });
  print(response.data, argv);
};
