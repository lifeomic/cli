'use strict';

const program = require('commander');
const { post } = require('../ga4gh');
const options = require('../common-options');
const print = require('../print');

const BASE_URL = '/reads';

options(program, 'ga4gh-reads <readgroupsetId>')
  .description('Search reads')
  .option('--reference <reference>', 'The reference to search within')
  .option('--start <start>', 'The start coordinate position')
  .option('--end <end>', 'The end coordinate position')
  .option('--page-size <pageSize>', 'Number of items to return', 5)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (readgroupsetId, options) => {
    const response = await post(options, `${BASE_URL}/search`, {
      readGroupSetIds: [readgroupsetId],
      start: parseInt(options.start, 10),
      end: parseInt(options.end, 10),
      referenceName: options.reference,
      pageSize: options.pageSize,
      pageToken: options.nextPageToken
    });
    print(response.data, options);
  });

module.exports = program;
