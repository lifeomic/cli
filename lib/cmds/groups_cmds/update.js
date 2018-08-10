'use strict';

const { put } = require('../../api');
const print = require('../../print');

exports.command = 'update <groupId> <name>';
exports.desc = 'Update group <groupId> with name <name>';
exports.builder = yargs => {
  yargs.positional('groupId', {
    describe: 'The group ID.',
    type: 'string'
  }).positional('name', {
    describe: 'The group name.',
    type: 'string'
  }).option('description', {
    describe: 'Group description',
    alias: 'd',
    type: 'string'
  });
};

exports.handler = async argv => {
  const opts = {
    id: argv.groupId,
    name: argv.name
  };
  if (argv.description) {
    opts.description = argv.description;
  }

  const response = await put(argv, `/v1/account/groups/${argv.groupId}`, opts);
  print(response.data, argv);
};
