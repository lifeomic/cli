'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create-document <projectId> <fileId>';
exports.desc = 'Create an OCR-document in project <projectId>.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project which will own this cohort for billing purposes.',
    type: 'string'
  }).positional('fileId', {
    describe: 'The ID of file (file-service ID) that needs OCR.',
    type: 'string'
  }).option({
    s: {
      alias: 'subject-id',
      describe: 'The ID of subject which the document relates',
      type: 'string'
    }
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/ocr/documents`, {
    project: argv.projectId,
    fileId: argv.fileId,
    ...(argv.subjectId ? { subject: argv.subjectId } : {})
  });
  print(response.data, argv);
};
