'use strict';

const { get } = require('../../apps');
const print = require('../../print');

exports.command = 'get <projectId> <type>';
exports.desc = 'Get Layouts information by <projectId> - <type> Patient|Insights';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project which layouts to fetch.',
    type: 'string'
  }).positional('type', {
    describe: 'The type of the layout of the project which layouts to fetch.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/configuration/layouts?project=${argv.projectId}&type=${argv.type}&format=json`);
  print(response.data, argv);
};
