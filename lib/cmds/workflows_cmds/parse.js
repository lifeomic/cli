'use strict';

const { post } = require('../../workflow');
const print = require('../../print');

exports.command = 'parse <datasetId>';
exports.desc = 'Parse a workflow and show expected inputs and input types';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('toolId', {
    describe: 'The ID of the tool to submit for parsing',
    alias: 't',
    type: 'string',
    demandOption: true
  });
};

exports.handler = async argv => {
  const payload = {
    datasetId: argv.datasetId,
    workflowSourceFileId: argv.toolId
  };

  const response = await post(argv, `/workflows/ga4gh/wes/runs/parse`, payload);
  print(response.data, argv);
};
