'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create <name>';
exports.desc = 'Create a group with name <name>';
exports.builder = yargs => {
  yargs.positional('name', {
    describe: 'The group name.',
    type: 'string'
  }).option('description', {
    describe: 'Group description',
    alias: 'd',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/account/groups`, {
    name: argv.name,
    description: argv.description
  });
  print(response.data, argv);
};
