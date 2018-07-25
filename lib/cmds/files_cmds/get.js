'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get <fileId>';
exports.desc = 'Fetch file information by <fileId>';
exports.builder = yargs => {
  yargs.positional('fileId', {
    describe: 'The ID of the file to fetch.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/files/${argv.fileId}`);
  print(response.data, argv);
};
