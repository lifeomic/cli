'use strict';

const { put } = require('../../api');
const print = require('../../print');

exports.command = 'members-add <groupId> <userId>';
exports.desc = 'Add user <userId> to group <groupId>';
exports.builder = yargs => {
  yargs.positional('groupId', {
    describe: 'The group ID',
    type: 'string'
  }).positional('userId', {
    describe: 'The user ID',
    type: 'string'
  });
};

exports.handler = async argv => {
  await put(argv, `/v1/account/groups/${argv.groupId}/members/${argv.userId}`);
  print({id: argv.userId}, argv);
};
