'use strict';

const { del } = require('../../api');
const print = require('../../print');

exports.command = 'delete-test <projectId> <testId>';
exports.desc = 'Delete a genomic test and all of its resources.';
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
  const response = await del(argv, `/v1/genomics/projects/${argv.projectId}/tests/${argv.testId}`);
  print(response.data, argv);
};
