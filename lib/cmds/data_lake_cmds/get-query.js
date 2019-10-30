'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get-query <queryId>';
exports.desc = 'Fetch a single query execution.';
exports.builder = yargs => {
  yargs.positional('queryId', {
    describe: 'Id of the query to fetch.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/analytics/query/${argv.queryId}`);
  print(response.data, argv);
};
