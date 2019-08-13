'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'schedule-job';
exports.desc = 'Schedules an Insights rebuild job';
exports.builder = yargs => {
  yargs.options({
    type: {
      alias: 't',
      describe: 'The job data type.',
      type: 'string',
      choices: ['gene', 'patient', 'variant', 'gnosishg37', 'gnosishg38', 'copynumber', 'fusion'],
      demandOption: true
    },
    action: {
      describe: 'The job action to perform.',
      type: 'string',
      alias: 'a',
      choices: ['aggregate', 'delete'],
      demandOption: true
    },
    projectId: {
      describe: 'The project to rebuild.',
      type: 'string',
      alias: 'p'
    },
    setIds: {
      describe: 'A list of set Ids to include in the rebuild job.',
      type: 'array',
      alias: 's'
    }
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/analytics/jobs`, {
    type: argv.type,
    action: argv.action,
    datasetId: argv.projectId,
    setIds: argv.setIds
  });
  print(response.data, argv);
};
