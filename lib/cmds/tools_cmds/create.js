'use strict';

const { post } = require('../../tool');
const fs = require('fs');
const print = require('../../print');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const {
  getFileVerificationStream
} = require('../../api');

exports.command = 'create';
exports.desc = 'Create a tool';
exports.builder = (yargs) => {
  yargs
    .option('name', {
      describe: 'The name of the tool',
      alias: 'n',
      type: 'string',
      demandOption: true
    })
    .option('description', {
      describe: 'A description of the tool',
      alias: 'd',
      type: 'string',
      demandOption: true
    })
    .option('access', {
      describe: 'The Access level for the tool',
      alias: 'a',
      choices: ['PRIVATE', 'ACCOUNT', 'PHC', 'PUBLIC'],
      type: 'string',
      demandOption: true
    })
    .option('tool-version', {
      describe: 'The version for the tool',
      alias: 's',
      type: 'string',
      demandOption: true
    })
    .option('tool-class', {
      describe: 'The type of tool',
      alias: 't',
      choices: ['Workflow', 'Notebook'],
      type: 'string',
      demandOption: true
    })
    .option('tool-file', {
      describe: 'The tool file',
      alias: 'f',
      type: 'string',
      demandOption: true
    })
    .option('labels', {
      describe: 'A comma delimited list of labels used to describe the tool',
      alias: 'l',
      type: 'string',
      demandOption: false
    });
};

exports.handler = async (argv) => {
  const payload = {
    version: argv.toolVersion,
    access: argv.access,
    name: argv.name,
    toolClassId: argv.toolClass === 'Workflow' ? '1' : '10',
    descriptorType: argv.toolClass === 'Workflow' ? 'CWL' : 'NOTEBOOK',
    description: argv.description,
    labels: argv.labels
  };

  if (argv.labels) {
    payload.labels = argv.labels.split(',');
  }

  const response = await post(argv, '/trs/v2/tools', payload);
  const uploadPayload = {
    fileName: argv.toolFile.split('/').pop(),
    toolId: response.data.id,
    version: response.data.meta_version
  };

  const uploadRequest = await post(argv, '/trs/files', uploadPayload);
  const stats = fs.statSync(argv.toolFile);
  const fileSize = stats['size'];
  const verifyStream = await getFileVerificationStream(argv.toolFile, fileSize);
  await axios({
    method: 'put',
    url: uploadRequest.data.uploadUrl,
    data: verifyStream.data,
    'axios-retry': {
      retryCondition: err =>
        (axiosRetry.isNetworkOrIdempotentRequestError(err) ||
          (err.response.status >= 400 && err.response.status < 500))
    }
  });

  print(response.data, argv);
};
