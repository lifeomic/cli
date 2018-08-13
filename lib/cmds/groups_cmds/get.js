'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get <groupId>';
exports.desc = 'Get group information by <groupId>';
exports.builder = yargs => {
  yargs.positional('groupId', {
    describe: 'The ID of the group to fetch.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/account/groups/${argv.groupId}`);
  print(response.data, argv);
};
