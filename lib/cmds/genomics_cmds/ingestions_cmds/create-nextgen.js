'use strict';

const { post } = require('../../../api');
const print = require('../../../print');

exports.command = 'create-nextgen <projectId> <tarFileId>';
exports.desc = 'Create NextGen ingestion for <tarFileId> in <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('tarFileId', {
    describe: 'The ID of the TAR file.',
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
    ingestionType: 'NextGen',
    inputFiles: {
      tar: argv.tarFileId
    },
    notificationConfig: {
      succeededEmail: argv.succeededEmail,
      failedEmail: argv.failedEmail
    }
  });
  print(response.data, argv);
};
