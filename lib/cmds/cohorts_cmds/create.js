'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'create <name>';
exports.desc = 'Create a cohort with name <name> in project <projectId>.  JSON queries can be read from stdin.';
exports.builder = yargs => {
  yargs.positional('name', {
    describe: 'The cohort name.',
    type: 'string'
  }).options({
    projectId: {
      describe: 'The ID of the project which will own this cohort for billing purposes.',
      alias: 'p',
      type: 'string',
      demandOption: true
    },
    description: {
      describe: 'Cohort description',
      alias: 'd',
      type: 'string'
    }
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/cohorts`, {
    name: argv.name,
    description: argv.description,
    ownerProject: argv.projectId,
    queries: await read(argv)
  });
  print(response.data, argv);
};
