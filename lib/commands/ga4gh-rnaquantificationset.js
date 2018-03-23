'use strict';

const program = require('commander');
const { get, post, del } = require('../ga4gh');
const options = require('../common-options');
const print = require('../print');

const BASE_URL = '/rnaquantificationsets';

options(program, 'ga4gh-rnaquantificationsets <datasetId>')
  .description('List rnaquantificationsets')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (datasetId, options) => {
    const response = await post(options, `${BASE_URL}/search`, {
      datasetIds: [datasetId],
      pageSize: options.pageSize,
      pageToken: options.nextPageToken
    });
    print(response.data, options);
  });

options(program, 'ga4gh-rnaquantificationsets-get <rnaquantificationsetId>')
  .description('Fetch a rnaquantificationset')
  .action(async (rnaquantificationsetId, options) => {
    const response = await get(options, `${BASE_URL}/${rnaquantificationsetId}`);
    print(response.data, options);
  });

options(program, 'ga4gh-rnaquantificationsets-delete <rnaquantificationsetId>')
  .description('Delete a rnaquantificationset')
  .action(async (rnaquantificationsetId, options) => {
    const response = await del(options, `${BASE_URL}/${rnaquantificationsetId}`);
    print(response.data, options);
  });

options(program, 'ga4gh-rnaquantificationsets-create <datasetId>')
  .description('Create a rnaquantificationset')
  .option('-n,--name <name>', 'The name of the rnaquantificationset')
  .option('-f,--file <file>', 'The ID of the RGEL file to index')
  .action(async (datasetId, options) => {
    const response = await post(options, BASE_URL, {
      datasetId: datasetId,
      fileId: options.file,
      name: options.name
    });
    print(response.data, options);
  });

module.exports = program;
