'use strict';

const { put } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'update <name>';
exports.desc = 'Update a policy.  The policy is read from stdin';
exports.builder = yargs => {
  yargs.positional('name', {
    describe: 'The policy name.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const policy = await read(argv);
  const response = await put(argv, `/v1/policies/${argv.name}`, policy);
  print(response.data, argv);
};
