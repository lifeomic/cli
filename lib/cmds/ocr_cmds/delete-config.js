'use strict';

const { del } = require('../../api');
const print = require('../../print');

exports.command = 'delete-config <projectId>';
exports.desc = 'Delete an OCR configuration for <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to delete.',
    type: 'string'
  });
};

exports.handler = async argv => {
  await del(argv, `/v1/ocr/config/${argv.projectId}`);
  print(`Deleted ocr config: ${argv.projectId}`, argv);
};
