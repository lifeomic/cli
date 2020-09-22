'use strict';

const { patch } = require('../../api');
const print = require('../../print');

exports.command = 'update-test <projectId> <testId>';
exports.desc = 'Update test details by <projectId> and <testId>.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('testId', {
    describe: 'The test ID.',
    type: 'string'
  }).option('indexed-date', {
    describe: 'The date the genetic test was performed',
    demandOption: true,
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await patch(argv, `/v1/genomics/projects/${argv.projectId}/tests/${argv.testId}`, {
    indexedDate: argv.indexedDate
  });
  print(response.data, argv);
};
