'use strict';

const program = require('commander');
const querystring = require('querystring');
const { get, post, del, put } = require('../api');
const options = require('../common-options');
const print = require('../print');
const read = require('../read');
const formatPage = require('../formatPage');

const POLICIES_URL = '/v1/policies';
const EVALUATE_URL = '/v1/evaluated-policy';

options(program, 'policies')
  .description('List policies')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (options) => {
    const opts = {
      pageSize: options.pageSize,
      nextPageToken: options.nextPageToken
    };

    const response = await get(options, `${POLICIES_URL}?${querystring.stringify(opts)}`);
    print(formatPage(response.data), options);
  });

options(program, 'policies-create')
  .description('Create a new policy. The policy is read from stdin.')
  .action(async (options) => {
    const policy = await read(options);
    const response = await post(options, POLICIES_URL, policy);
    print(response.data, options);
  });

options(program, 'policies-update <name>')
  .description('Update an existing policy. The policy is read from stdin.')
  .action(async (name, options) => {
    const policy = await read(options);
    const response = await put(options, `${POLICIES_URL}/${name}`, policy);
    print(response.data, options);
  });

options(program, 'policies-get <name>')
  .description('Get a policy by name')
  .action(async (name, options) => {
    const response = await get(options, `${POLICIES_URL}/${name}`);
    print(response.data, options);
  });

options(program, 'policies-delete <name>')
  .description('Delete a policy')
  .action(async (name, options) => {
    await del(options, `${POLICIES_URL}/${name}`);
    print({name}, options);
  });

options(program, 'policies-evaluate [<userId>]')
  .description('Evaluate your policy or the policy of another user')
  .action(async (userId, options) => {
    let response;

    if (userId) {
      response = await get(options, `${EVALUATE_URL}?user=${userId}`);
    } else {
      response = await get(options, EVALUATE_URL);
    }

    print(response.data, options);
  });

module.exports = program;
