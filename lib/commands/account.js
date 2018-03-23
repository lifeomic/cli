'use strict';

const program = require('commander');
const querystring = require('querystring');
const { get } = require('../api');
const options = require('../common-options');
const print = require('../print');

options(program, 'accounts')
  .description('List accounts')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (options) => {
    const opts = {
      pageSize: options.pageSize,
      nextPageToken: options.nextPageToken
    };

    const response = await get(options, `/v1/accounts?${querystring.stringify(opts)}`);
    print(response.data, options);
  });

options(program, 'accounts-get <account>')
  .description('Fetch an account')
  .action(async (account, options) => {
    const response = await get(options, `/v1/accounts/${account}?include=groups`);
    print(response.data, options);
  });
