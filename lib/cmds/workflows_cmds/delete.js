'use strict';

const { del } = require('../../workflow');
const print = require('../../print');

exports.command = 'delete <workflowId>';
exports.desc = 'Delete template by ID <workflowId>.';
exports.builder = yargs => {
  yargs.positional('workflowId', {
    describe: 'The workflow ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/workflows/ga4gh/wes/runs/${argv.workflowId}`);
  print(response.data, argv);
};
