'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');

exports.command = 'members <groupId>';
exports.desc = 'List group members by group <groupId>';
exports.builder = yargs => {
  yargs.positional('groupId', {
    describe: 'The ID of the group to search within.',
    type: 'string'
  }).option('page-size', {
    describe: 'Number of items to return',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('next-page-token', {
    describe: 'Next page token',
    alias: 't',
    type: 'string'
  });
};

exports.handler = async argv => {
  const opts = {
    pageSize: argv.pageSize
  };

  if (argv.nextPageToken) {
    opts.name = argv.nextPageToken;
  }

  if (argv.prefix) {
    opts.name = argv.prefix;
  }

  const response = await get(argv, `/v1/account/groups/${argv.groupId}/members?${querystring.stringify(opts)}`);
  print(formatPage(response.data), argv);
};
