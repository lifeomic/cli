'use strict';

const program = require('commander');
const querystring = require('querystring');
const { get, post } = require('../api');
const options = require('../common-options');
const print = require('../print');
const read = require('../read');
const formatPage = require('../formatPage');
const fs = require('fs');

const ANALYTICS_URL = '/v1/analytics';

options(program, 'insights-run-query <datasetId>')
  .description('Submits a json query to the Lifeomic analytics API.')
  .option('--query <query>', 'file containing json query')
  .action(async (datasetId, options) => {
    const response = await post(options, `${ANALYTICS_URL}/dsl`, {
      dataset_id: datasetId,
      query: JSON.parse(fs.readFileSync(options.query, 'utf8'))
    });
    print(response.data, options);
  });

module.exports = program;
