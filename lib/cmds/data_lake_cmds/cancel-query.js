'use strict';

const { del } = require('../../api');
const print = require('../../print');

exports.command = 'cancel-query <queryId>';
exports.desc = 'Cancel a single query execution.';
exports.builder = yargs => {
  yargs.positional('queryId', {
    describe: 'Id of the query to cancel.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/v1/analytics/data-lake/query/${argv.queryId}`);
  print(response.data, argv);
};
