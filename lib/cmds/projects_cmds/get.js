'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get <projectId>';
exports.desc = 'Get project information by <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to fetch.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/projects/${argv.projectId}`);
  print(response.data, argv);
};
