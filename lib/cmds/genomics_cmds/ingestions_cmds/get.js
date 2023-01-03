'use strict';

const { get } = require('../../../api');
const print = require('../../../print');

exports.command = 'get <projectId> <ingestionId>';
exports.desc = 'Fetch ingestion details by <projectId> and <ingestionId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The project ID.',
    type: 'string'
  }).positional('ingestionId', {
    describe: 'The ingestion ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/genomic-ingestion/projects/${argv.projectId}/ingestions/${argv.ingestionId}`);
  print(response.data, argv);
};
