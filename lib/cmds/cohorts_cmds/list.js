'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');

exports.command = 'list <projectId>';
exports.desc = 'List cohorts by project <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to search within.',
    type: 'string'
  }).option('prefix', {
    describe: 'Filter cohorts where the name beings with a prefix',
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
    projectId: argv.projectId,
    pageSize: argv.pageSize,
    nextPageToken: argv.nextPageToken
  };

  if (argv.prefix) {
    opts.name = argv.prefix;
  }

  const response = await get(argv, `/v1/cohorts?${querystring.stringify(opts)}`);
  print(formatPage(response.data), argv);
};
