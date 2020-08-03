'use strict';

const { get } = require('../../api');
const print = require('../../print');
const querystring = require('querystring');

exports.command = 'get-document <projectId> <id>';
exports.desc = 'Fetch OCR document by <id>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project.',
    type: 'string'
  }).positional('id', {
    describe: 'The ID of the ICR document.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const opts = {
    project: argv.projectId
  };
  const response = await get(argv, `/v1/ocr/documents/${argv.id}?${querystring.stringify(opts)}`);
  print(response.data, argv);
};
