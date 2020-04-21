'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'list-schemas <projectId>';
exports.desc = 'List the schemas of all tables in the data lake for this project.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to fetch schemas of.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/analytics/data-lake/schema?datasetId=${argv.projectId}`);
  print(response.data, argv);
};
