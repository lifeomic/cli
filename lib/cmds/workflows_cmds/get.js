'use strict';

const { get } = require('../../workflow');
const print = require('../../print');

exports.command = 'get <workflowId>';
exports.desc = 'Fetch a workflow by ID <workflowId>.';
exports.builder = yargs => {
  yargs.positional('workflowId', {
    describe: 'The workflowId ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/workflows/ga4gh/wes/runs/${argv.workflowId}`);
  print(response.data, argv);
};
