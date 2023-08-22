'use strict';

const { get } = require('../../../api');
const print = require('../../../print');

exports.command = 'get-by-germline-case <projectId> <germlineCaseId>';
exports.desc = 'Fetch ingestion details by <projectId> and <germlineCaseId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('germlineCaseId', {
    describe: 'The germline case ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/genomic-ingestion/projects/${argv.projectId}/ingestions/germline-cases/${argv.germlineCaseId}`);
  print(response.data, argv);
};
