'use strict';

const { list } = require('../../workflow');
const print = require('../../print');

exports.command = 'list-templates <datasetId>';
exports.desc = 'List templates by dataset <datasetId>.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset id.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await list(argv, `/workflows/templates?datasetId=${argv.datasetId}`);
  print(response, argv);
};
