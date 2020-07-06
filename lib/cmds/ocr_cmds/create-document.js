'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create-document <projectId> <subjectId> <fileId>';
exports.desc = 'Create an OCR-document in project <projectId>.  JSON queries can be read from stdin.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project which will own this cohort for billing purposes.',
    type: 'string'
  }).positional('subjectId', {
    describe: 'The ID of subject which the document relates.',
    type: 'string'
  }).positional('fileId', {
    describe: 'The ID of file (file-service ID) that needs OCR.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/ocr/documents`, {
    project: argv.projectId,
    subject: argv.subjectId,
    fileId: argv.fileId
  });
  print(response.data, argv);
};
