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
  .action(async (datasetId, options) => {
    const response = await post(options, `${ANALYTICS_URL}/dsl`, {
      dataset_id: datasetId,
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      query: JSON.parse(fs.readFileSync(options.query, 'utf8'))
    });
    print(response.data, options);
  });

module.exports = program;
