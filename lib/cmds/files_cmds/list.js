'use strict';

const querystring = require('querystring');
const { get, list } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');

exports.command = 'list <datasetId>';
exports.desc = 'List files by dataset <datasetId>';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The ID of the dataset to search within.',
    type: 'string'
  }).option('prefix', {
    describe: 'Filter files where the name beings with a prefix',
    alias: 'p',
    type: 'string'
  }).option('page-size', {
    describe: 'The page size',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('next-page-token', {
    describe: 'Next page token',
    alias: 't',
    type: 'string'
  }).option('limit', {
    describe: 'The maximum number of items to return',
    alias: 'l',
    type: 'number'
  }).option('order-by', {
    describe: 'Property to order files by',
    default: 'name',
    alias: 'o',
    type: 'string',
    choices: ['name', 'size']
  });
};

exports.handler = async argv => {
  const opts = {
    datasetId: argv.datasetId,
    pageSize: argv.limit ? 1000 : argv.pageSize,
    nextPageToken: argv.nextPageToken,
    orderBy: argv.orderBy
  };

  if (argv.prefix) {
    opts.name = argv.prefix;
  }
  const path = `/v1/files?${querystring.stringify(opts)}`;

  const response = await (argv.limit ? list(argv, path) : get(argv, path));
  print(formatPage(response.data), argv);
};
