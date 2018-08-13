'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get <accountId>';
exports.desc = 'Get accounts information by <accountId>';
exports.builder = yargs => {
  yargs.positional('accountId', {
    describe: 'The ID of the account to fetch.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/accounts/${argv.accountId}`);
  print(response.data, argv);
};
