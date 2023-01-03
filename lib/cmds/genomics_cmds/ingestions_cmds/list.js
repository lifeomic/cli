'use strict';

const querystring = require('querystring');
const { get, list } = require('../../../api');
const print = require('../../../print');
const formatPage = require('../../../formatPage');

exports.command = 'list <projectId>';
exports.desc = 'List ingestions by <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).option('page-size', {
    describe: 'The page size.',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('next-page-token', {
    describe: 'The next page token.',
    alias: 't',
    type: 'string'
  }).option('limit', {
    describe: 'The maximum number of items to return.',
    alias: 'l',
    type: 'number'
  }).option('name', {
    describe: 'Filter ingestions where the ingestion name contains this',
    type: 'string'
  }).option('failed', {
    describe: 'Filter ingestions that have failed',
    type: 'boolean'
  }).option('step', {
    describe: 'Filter ingestions that are on this step',
    type: 'string',
    choices: ['AwaitingFiles', 'Submitted', 'Transformed', 'Normalized', 'TestCreated', 'TestNotCreated']
  });
};

exports.handler = async argv => {
  const opts = {
    projectId: argv.projectId,
    pageSize: argv.limit ? 1000 : argv.pageSize,
    nextPageToken: argv.nextPageToken,
    name: argv.name,
    failed: argv.failed,
    steps: argv.step
  };

  const path = `/v1/genomic-ingestion/projects/${argv.projectId}/ingestions?${querystring.stringify(opts)}`;

  const response = await (argv.limit ? list(argv, path) : get(argv, path));
  print(formatPage(response.data), argv);
};
