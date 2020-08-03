'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get-test <projectId> <testId>';
exports.desc = 'Fetch test details by <projectId> and <testId>.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('testId', {
    describe: 'The test ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/genomics/projects/${argv.projectId}/tests/${argv.testId}`);
  print(response.data, argv);
};
