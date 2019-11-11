'use strict';

const { get } = require('../../workflow');
const print = require('../../print');

exports.command = 'get-workflow <workflowId>';
exports.desc = 'Fetch a workflow set by ID <workflowId>.';
exports.builder = yargs => {
  yargs.positional('workflowId', {
    describe: 'The workflowId set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/workflows/${argv.workflowId}`);
  print(response.data, argv);
};
