'use strict';

const { post } = require('../../../api');
const print = require('../../../print');

exports.command = 'create-caris-bam <projectId> <bamFileId>';
exports.desc = 'Create Caris BAM ingestion for <bamFileId> in <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('bamFileId', {
    describe: 'The ID of the BAM file.',
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
    ingestionType: 'CarisBam',
    inputFiles: {
      bam: argv.bamFileId
    },
    notificationConfig: {
      succeededEmail: argv.succeededEmail,
      failedEmail: argv.failedEmail
    }
  });
  print(response.data, argv);
};
