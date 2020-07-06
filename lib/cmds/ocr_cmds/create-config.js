'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create-config <projectId>';
exports.desc = 'Create an OCR-document in project <projectId>.  JSON queries can be read from stdin.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project which will own this cohort for billing purposes.',
    type: 'string'
  }).options({
    denoiserSwitch: {
      describe: 'Flag for denoiser control. Allowed values: ON|OFF|SMART.',
      type: 'string'
    },
    pathPrefix: {
      describe: 'Path prefix on file-service where denoised and text files are stored',
      type: 'string'
    }
  });
};

exports.handler = async argv => {
  if (argv.denoiserSwitch || argv.pathPrefix) {
    const response = await post(argv, '/v1/ocr/config', {
      project: argv.projectId,
      config: {
        denoiserSwitch: argv.denoiserSwitch,
        pathPrefix: argv.pathPrefix
      }
    });
    print(response.data, argv);
  }
};
