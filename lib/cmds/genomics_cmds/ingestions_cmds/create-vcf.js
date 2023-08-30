'use strict';

const { post } = require('../../../api');
const print = require('../../../print');

exports.command = 'create-vcf <projectId> <vcfFileId> <manifestFileId>';
exports.desc = 'Create VCF ingestion for <vcfFileId> and <manifestFileId> in <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('vcfFileId', {
    describe: 'The ID of the VCF file.',
    type: 'string'
  }).positional('manifestFileId', {
    describe: 'The ID of the manifest file.',
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
    ingestionType: 'Vcf',
    inputFiles: {
      vcf: argv.vcfFileId,
      manifest: argv.manifestFileId
    },
    notificationConfig: {
      succeededEmail: argv.succeededEmail,
      failedEmail: argv.failedEmail
    }
  });
  print(response.data, argv);
};
