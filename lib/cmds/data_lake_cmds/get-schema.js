'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get-schema <projectId>';
exports.desc = 'Fetch a single query execution.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to fetch the schema from.',
    type: 'string'
  }).option('table', {
    alias: 't',
    type: 'string',
    describe: 'Name of the table to fetch the schema of. The possible list of choices are provided. Note, not every project will have every table',
    demandOption: true,
    choices: [
      'condition',
      'condition_summaries',
      'condition_summary',
      'conditions',
      'copynumber',
      'demographic',
      'dosage',
      'fusion',
      'gene',
      'media',
      'medication',
      'observation',
      'patient',
      'procedure',
      'procedures',
      'sequence',
      'specimen',
      'variant'
    ]
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/analytics/data-lake/schema/${argv.table}?datasetId=${argv.projectId}`);
  print(response.data, argv);
};
