'use strict';

const querystring = require('querystring');
const { get, list } = require('../../api');
const print = require('../../print');

exports.command = 'list-tests <projectId> [subjectId]';
exports.desc = 'List genomic tests by project <projectId> and optionally [subjectId].';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('subjectId', {
    describe: 'The subject ID.',
    type: 'string'
  }).option('page-size', {
    describe: 'The page size (only used when listing by project)',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('next-page-token', {
    describe: 'Next page token (only used when listing by project)',
    alias: 't',
    type: 'string'
  }).option('limit', {
    describe: 'The maximum number of items to return (only used when listing by project)',
    alias: 'l',
    type: 'number'
  }).option('status', {
    describe: 'Filter tests by status (only used when listing by project)',
    alias: 's',
    type: 'string',
    choices: ['ACTIVE', 'INDEXING', 'FAILED']
  });
};

exports.handler = async argv => {
  if (argv.subjectId) {
    const response = await get(argv, `/v1/genomics/projects/${argv.projectId}/subjects/${argv.subjectId}/tests`);
    print(response.data, argv);
  } else {
    const opts = {
      pageSize: argv.limit ? 1000 : argv.pageSize,
      nextPageToken: argv.nextPageToken
    };

    if (argv.status) {
      opts.status = argv.status;
    }

    const path = `/v1/genomics/projects/${argv.projectId}/tests?${querystring.stringify(opts)}`;

    const response = await (argv.limit ? list(argv, path) : get(argv, path));
    print(response.data, argv);
  }
};
