'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create <name>';
exports.desc = 'Create an API key with <name>';
exports.builder = yargs => {
  yargs.positional('name', {
    describe: 'The API key name.',
    type: 'string'
  }).option('expire-in-days', {
    describe: 'Number of days before key expires',
    type: 'number',
    alias: 'e',
    default: 365
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/api-keys`, {
    name: argv.name,
    expireInDays: parseInt(argv.expireInDays)
  });
  print(response.data, argv);
};
