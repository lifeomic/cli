'use strict';

const program = require('commander');
const querystring = require('querystring');
const { get, post, put, del } = require('../api');
const options = require('../common-options');
const print = require('../print');
const formatPage = require('../formatPage');

const GROUPS_URL = '/v1/account/groups';

options(program, 'groups')
  .description('List groups')
  .option('--prefix <prefix>', 'Filter groups where the name begins with a prefix')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (options) => {
    const opts = {
      pageSize: options.pageSize
    };

    if (options.nextPageToken) {
      opts.nextPageToken = options.nextPageToken;
    }

    if (options.prefix) {
      opts.name = options.prefix;
    }

    const response = await get(options, `${GROUPS_URL}?${querystring.stringify(opts)}`);
    print(formatPage(response.data), options);
  });

options(program, 'groups-create <name> [<description>]')
  .description('Create a new group.')
  .action(async (name, description, options) => {
    const group = {name};
    if (description) {
      group.description = description;
    }
    const response = await post(options, GROUPS_URL, group);
    print(response.data, options);
  });

options(program, 'groups-get <groupId>')
  .description('Get a group')
  .action(async (groupId, options) => {
    const response = await get(options, `${GROUPS_URL}/${groupId}`);
    print(response.data, options);
  });

options(program, 'groups-update <groupId> <name> [<description>]')
  .description('Update a group')
  .action(async (groupId, name, description, options) => {
    const group = {id: groupId, name};
    if (description) {
      group.description = description;
    }
    const response = await put(options, `${GROUPS_URL}/${groupId}`, group);
    print(response.data, options);
  });

options(program, 'groups-members <groupId>')
  .description('List group members')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (groupId, options) => {
    const opts = {
      pageSize: options.pageSize
    };

    if (options.nextPageToken) {
      opts.nextPageToken = options.nextPageToken;
    }

    const response = await get(options, `${GROUPS_URL}/${groupId}/members?${querystring.stringify(opts)}`);
    print(formatPage(response.data), options);
  });

options(program, 'groups-members-remove <groupId> <userId>')
  .description('Remove a user from a group')
  .action(async (groupId, userId, options) => {
    await del(options, `${GROUPS_URL}/${groupId}/members/${userId}`);
    print({id: userId}, options);
  });

options(program, 'groups-members-add <groupId> <userId>')
  .description('Add a user to a group')
  .action(async (groupId, userId, options) => {
    await put(options, `${GROUPS_URL}/${groupId}/members/${userId}`);
    print({id: userId}, options);
  });

module.exports = program;
