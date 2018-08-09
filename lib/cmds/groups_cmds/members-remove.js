'use strict';

const { del } = require('../../api');
const print = require('../../print');

exports.command = 'members-remove <groupId> <userId>';
exports.desc = 'Remove user <userId> from group <groupId>';
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
  await del(argv, `/v1/account/groups/${argv.groupId}/members/${argv.userId}`);
  print({id: argv.userId}, argv);
};
