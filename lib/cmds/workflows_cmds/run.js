'use strict';

const { post } = require('../../workflow');
const print = require('../../print');

exports.command = 'run <datasetId>';
exports.desc = 'Run workflow';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('name', {
    describe: 'The name of the workflow execution',
    alias: 'n',
    type: 'string',
    demandOption: true
  }).option('toolId', {
    describe: 'The ID of the tool to submit for execution',
    alias: 't',
    type: 'string',
    demandOption: true
  }).option('workflow-inputs', {
    describe: 'A JSON string containing the input values required by the tool',
    alias: 'i',
    type: 'string',
    demandOption: false
  }).option('workflow-inputs-file-id', {
    describe: 'A ID of the file containing the input values required by the tool',
    alias: 'f',
    type: 'string',
    demandOption: false
  }).option('output-project-folder', {
    describe: 'Provide a custom path within PHC for workflow outputs to be uploaded',
    alias: 'p',
    type: 'string',
    demandOption: false
  });
};

exports.handler = async argv => {
  if ((argv.workflowInputs === null && argv.workflowInputsFileId === null) ||
    (argv.workflowInputs && argv.workflowInputsFileId)) {
    throw new Error(`Either workflow-inputs OR workflow-inputs-file-id is required`);
  }

  if (argv.workflowInputs) {
    const inputs = JSON.parse(argv.workflowInputs);
    const payload = {
      datasetId: argv.datasetId,
      name: argv.name,
      workflowSourceFileId: argv.toolId,
      workflowInputs: inputs,
      outputProjectFolder: argv.outputProjectFolder
    };
    const response = await post(argv, `/workflows/ga4gh/wes/runs`, payload);
    print(response.data, argv);
  } else {
    const payload = {
      datasetId: argv.datasetId,
      name: argv.name,
      workflowSourceFileId: argv.toolId,
      workflowInputsFileId: argv.workflowInputsFileId,
      outputProjectFolder: argv.outputProjectFolder
    };
    const response = await post(argv, `/workflows/ga4gh/wes/runs`, payload);
    print(response.data, argv);
  }
};
