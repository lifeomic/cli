'use strict';

const print = require('../../print');
const { del } = require('../../api');

exports.command = 'delete <apiKeyId>';
exports.desc = 'Delete an API key by <apiKeyId>';
exports.builder = yargs => {
  yargs.positional('fileId', {
    describe: 'The ID of the file to delete.',
    type: 'string'
  });
};

exports.handler = async argv => {
  await del(argv, `/v1/api-keys/${argv.apiKeyId}`);
  print({ id: argv.apiKeyId }, argv);
};
