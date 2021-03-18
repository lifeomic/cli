'use strict';

const { post } = require('../../tool');
const fs = require('fs');
const print = require('../../print');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const {
  getFileVerificationStream,
  multipartUpload,
  MULTIPART_MIN_SIZE
} = require('../../api');
const chalk = require('chalk');

exports.command = 'add-version <toolId>';
exports.desc = 'Add a version to a tool <toolId>';
exports.builder = (yargs) => {
  yargs
    .positional('toolId', {
      describe: 'The tool ID.',
      type: 'string'
    })
    .option('tool-version', {
      describe: 'The new version to add',
      alias: 's',
      type: 'string',
      demandOption: true
    })
    .option('tool-file', {
      describe: 'The tool file',
      alias: 'f',
      type: 'string',
      demandOption: true
    })
    .option('is-default', {
      describe: 'Set this version as the default',
      alias: 'd',
      type: 'boolean',
      default: false,
      demandOption: false
    });
};

exports.handler = async (argv) => {
  const payload = {
    version: argv.toolVersion,
    isDefault: argv.isDefault
  };

  const response = await post(argv, `/trs/v2/tools/${argv.toolId}/versions`, payload);
  const fileName = argv.toolFile.split('/').pop();
  const uploadPayload = {
    fileName: fileName,
    toolId: response.data.id,
    version: response.data.meta_version
  };

  const stats = fs.statSync(argv.toolFile);
  const fileSize = stats['size'];
  if (fileSize > multiPartMinSize()) {
    const uploadResponse = await post(argv, '/trs/uploads', uploadPayload);
    await multipartUpload(argv, uploadResponse.data.uploadId, argv.toolFile, fileSize, 'v1/trs/uploads');
    console.log(
      chalk.green(`Upload of tool file ${fileName} complete`)
    );
  } else {
    const uploadRequest = await post(argv, '/trs/files', uploadPayload);
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
  }

  print(response.data, argv);
};

// used to enable/disable multipart for unit tests
function multiPartMinSize () {
  return process.env.TOOL_MULTIPART_MIN_SIZE || MULTIPART_MIN_SIZE;
}
