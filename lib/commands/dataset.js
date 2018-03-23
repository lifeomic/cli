'use strict';

const program = require('commander');
const querystring = require('querystring');
const { get, post, del } = require('../api');
const options = require('../common-options');
const formatPage = require('../formatPage');
const print = require('../print');

const BASE_URL = '/v1/datasets';

options(program, 'datasets')
  .description('List datasets')
  .option('--prefix <prefix>', 'Find datasets that start with <prefix>')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (options) => {
    const opts = {
      pageSize: options.pageSize,
      nextPageToken: options.nextPageToken
    };

    if (options.prefix) {
      opts.name = options.prefix;
    }

    const response = await get(options, `${BASE_URL}?${querystring.stringify(opts)}`);
    print(formatPage(response.data), options);
  });

options(program, 'datasets-get <dataset>')
  .description('Fetch a dataset')
  .action(async (dataset, options) => {
    const response = await get(options, `${BASE_URL}/${dataset}`);
    print(response.data, options);
  });

options(program, 'datasets-delete <dataset>')
  .description('Delete a dataset')
  .action(async (dataset, options) => {
    const response = await del(options, `${BASE_URL}/${dataset}`);
    print(response.data, options);
  });

options(program, 'datasets-create <name>')
  .description('Create a dataset')
  .action(async (name, options) => {
    const response = await post(options, BASE_URL, { name: name });
    print(response.data, options);
  });

module.exports = program;
