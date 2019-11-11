'use strict';

const { post } = require('../../workflow');
const print = require('../../print');

exports.command = 'build-workflow <datasetId>';
exports.desc = 'Create a workflow from existing resources';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('name', {
    describe: 'The name of the workflow',
    alias: 'n',
    type: 'string',
    demandOption: true
  }).option('template-id', {
    describe: 'The ID of the workflow template',
    alias: 't',
    type: 'string',
    demandOption: true
  }).option('parameters-id', {
    describe: 'The ID of the parameters to apply to the template',
    alias: 'p',
    type: 'string',
    demandOption: true
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/workflows`, {
    datasetId: argv.datasetId,
    name: argv.name,
    template: { id: argv.templateId, type: 'RESOURCE' },
    parameter: { id: argv.parametersId, type: 'RESOURCE' }
  });
  print(response.data, argv);
};
