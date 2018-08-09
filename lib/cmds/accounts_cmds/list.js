'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');

exports.command = 'list';
exports.desc = 'List accounts';
exports.builder = yargs => {
  yargs.option('page-size', {
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
    pageSize: argv.pageSize,
    nextPageToken: argv.nextPageToken
  };

  const response = await get(argv, `/v1/accounts?${querystring.stringify(opts)}`);
  print(formatPage(response.data), argv);
};
