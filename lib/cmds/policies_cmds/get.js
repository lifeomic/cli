'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get <name>';
exports.desc = 'Fetch policy information by <name>';
exports.builder = yargs => {
  yargs.positional('name', {
    describe: 'The policy name.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/policies/${argv.name}`);
  print(response.data, argv);
};
