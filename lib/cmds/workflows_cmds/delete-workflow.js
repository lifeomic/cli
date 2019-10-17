'use strict';

const { del } = require('../../workflow');
const print = require('../../print');

exports.command = 'delete-workflow <workflowId>';
exports.desc = 'Delete template by ID <workflowId>.';
exports.builder = yargs => {
  yargs.positional('workflowId', {
    describe: 'The workflow ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/workflows/${argv.workflowId}`);
  print(response.data, argv);
};
