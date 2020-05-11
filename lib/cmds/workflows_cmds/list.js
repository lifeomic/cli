'use strict';

const { list } = require('../../workflow');
const print = require('../../print');

exports.command = 'list <datasetId>';
exports.desc = 'List workflows by dataset <datasetId>.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset id.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await list(argv, `/workflows/ga4gh/wes/runs?datasetId=${argv.datasetId}`);
  print(response, argv);
};
