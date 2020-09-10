'use strict';

const { post } = require('../../workflow');
const print = require('../../print');

exports.command = 'create <datasetId>';
exports.desc = 'Create and run workflow';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('name', {
    describe: 'The name of the workflow',
    alias: 'n',
    type: 'string',
    demandOption: true
  }).option('workflow-file-id', {
    describe: 'The ID of the workflow source file to submit for execution',
    alias: 'w',
    type: 'string',
    demandOption: true
  }).option('workflow-inputs', {
    describe: 'A JSON string containing the input values required by the workflow file',
    alias: 'i',
    type: 'string',
    demandOption: false
  }).option('workflow-inputs-file-id', {
    describe: 'A ID of the file containing the input values required by the workflow file',
    alias: 'f',
    type: 'string',
    demandOption: false
  }).option('workflow-dependencies-file-ids', {
    describe: 'An comma seperated list of ids for the workflow source files that are used to resolve local imports',
    alias: 'd',
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

  const dependencies = argv.workflowDependenciesFileIds ? argv.workflowDependenciesFileIds.split(',') : null;

  if (argv.workflowInputs) {
    const inputs = JSON.parse(argv.workflowInputs);
    const payload = {
      datasetId: argv.datasetId,
      name: argv.name,
      workflowSourceFileId: argv.workflowFileId,
      workflowInputs: inputs,
      outputProjectFolder: argv.outputProjectFolder
    };
    if (argv.workflowDependenciesFileIds) {
      payload.workflowDependenciesFileIds = dependencies;
    }
    const response = await post(argv, `/workflows/ga4gh/wes/runs`, payload);
    print(response.data, argv);
  } else {
    const payload = {
      datasetId: argv.datasetId,
      name: argv.name,
      workflowSourceFileId: argv.workflowFileId,
      workflowInputsFileId: argv.workflowInputsFileId,
      outputProjectFolder: argv.outputProjectFolder
    };
    if (argv.workflowDependenciesFileIds) {
      payload.workflowDependenciesFileIds = dependencies;
    }
    const response = await post(argv, `/workflows/ga4gh/wes/runs`, payload);
    print(response.data, argv);
  }
};
