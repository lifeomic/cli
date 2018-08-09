'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');

exports.command = 'list';
exports.desc = 'List projects';
exports.builder = yargs => {
  yargs.option('prefix', {
    describe: 'Filter projects where the name beings with a prefix',
    alias: 'p',
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
    pageSize: argv.pageSize,
    nextPageToken: argv.nextPageToken
  };

  if (argv.prefix) {
    opts.name = argv.prefix;
  }

  const response = await get(argv, `/v1/projects?${querystring.stringify(opts)}`);
  print(formatPage(response.data), argv);
};
