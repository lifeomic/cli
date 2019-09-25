'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'list-tests <projectId> <subjectId>';
exports.desc = 'List genomic tests by <subjectId> in project <projectId>.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('subjectId', {
    describe: 'The subject ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/genomics/projects/${argv.projectId}/subjects/${argv.subjectId}/tests`);
  print(response.data, argv);
};
