'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get-job <jobId>';
exports.desc = 'Fetch a single Insights indexing job.';
exports.builder = yargs => {
  yargs.positional('jobId', {
    describe: 'Id of the indexing job to fetch.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/analytics/jobs/${argv.jobId}`);
  print(response.data, argv);
};
