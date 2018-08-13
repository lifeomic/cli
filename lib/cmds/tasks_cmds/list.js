'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');

exports.command = 'list <datasetId>';
exports.desc = 'List tasks by dataset <datasetId>';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The ID of the dataset to search within.',
    type: 'string'
  }).option('prefix', {
    describe: 'Filter files where the name beings with a prefix',
    alias: 'p',
    type: 'string'
  }).option('state', {
    describe: 'Filter tasks by state',
    alias: 's',
    type: 'string'
  }).option('view', {
    describe: 'Specify MINIMAL to just get task state',
    alias: 'v',
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
    pageSize: argv.pageSize,
    nextPageToken: argv.nextPageToken,
    datasetId: argv.datasetId
  };

  if (argv.prefix) {
    opts.name = argv.prefix;
  }

  if (argv.state) {
    opts.state = argv.state;
  }

  if (argv.view) {
    opts.view = argv.view;
  }

  const response = await get(argv, `/v1/tasks?${querystring.stringify(opts)}`);
  print(formatPage(response.data), argv);
};
