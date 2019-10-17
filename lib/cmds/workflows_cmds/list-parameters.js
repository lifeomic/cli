'use strict';

const { list } = require('../../workflow');
const print = require('../../print');

exports.command = 'list-parameters <datasetId>';
exports.desc = 'List parameters by dataset <datasetId>.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset id.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await list(argv, `/workflows/parameters?datasetId=${argv.datasetId}`);
  print(response, argv);
};
