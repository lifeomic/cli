'use strict';

const program = require('commander');
const { post } = require('../api');
const options = require('../common-options');
const print = require('../print');
const fs = require('fs');

const ANALYTICS_URL = '/v1/analytics';

options(program, 'insights-run-query <datasetId>')
  .description('Submits a json query to the Lifeomic analytics API.')
  .option('--query <query>', 'file containing json query')
  .option('--string-query <stringQuery>', 'String query to run in insights')
  .action(async (datasetId, options) => {
    const contract = {
      dataset_id: datasetId
    };
    if (options.query) {
      contract.query = JSON.parse(fs.readFileSync(options.query, 'utf8'));
    } else if (options.stringQuery) {
      contract.string_query = options.stringQuery;
    }
    const response = await post(options, `${ANALYTICS_URL}/dsl`, contract);
    print(response.data, options);
  });

module.exports = program;
