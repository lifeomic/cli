'use strict';

const { del } = require('../../api');
const print = require('../../print');
const querystring = require('querystring');

exports.command = 'delete-document <projectId> <id>';
exports.desc = 'Delete an OCR document by <id>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project.',
    type: 'string'
  }).positional('id', {
    describe: 'The ID of the OCR document.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const opts = {
    project: argv.projectId
  };
  await del(argv, `/v1/ocr/documents/${argv.id}?${querystring.stringify(opts)}`);
  print(`Deleted ocr document: ${argv.id}`, argv);
};
