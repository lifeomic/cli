'use strict';

const program = require('commander');
const querystring = require('querystring');
const { get, post, del } = require('../api');
const options = require('../common-options');
const formatPage = require('../formatPage');
const print = require('../print');

const BASE_URL = '/v1/api-keys';

options(program, 'api-keys')
  .description('List API keys')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (options) => {
    const opts = {
      pageSize: options.pageSize,
      nextPageToken: options.nextPageToken
    };

    const response = await get(options, `${BASE_URL}?${querystring.stringify(opts)}`);
    print(formatPage(response.data), options);
  });

options(program, 'api-keys-delete <apiKey>')
  .description('Delete an API key')
  .action(async (apiKey, options) => {
    const response = await del(options, `${BASE_URL}/${apiKey}`);
    print(response.data, options);
  });

options(program, 'api-keys-create <name>')
  .description('Create a project')
  .option('--expire-in-days <expireInDays>', 'Number of days before key expires', 365)
  .action(async (name, options) => {
    const response = await post(options, BASE_URL, {
      name,
      expireInDays: parseInt(options.expireInDays)
    });
    print(response.data, options);
  });

module.exports = program;
