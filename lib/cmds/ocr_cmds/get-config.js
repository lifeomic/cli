'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get-config <projectId>';
exports.desc = 'Fetch configuration information for project by <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/ocr/config/${argv.projectId}`);
  print(response.data, argv);
};
