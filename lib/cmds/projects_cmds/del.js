'use strict';

const { del } = require('../../api');
const print = require('../../print');

exports.command = 'delete <projectId>';
exports.desc = 'Delete a by <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to delete.',
    type: 'string'
  });
};

exports.handler = async argv => {
  await del(argv, `/v1/projects/${argv.projectId}`);
  print({ id: argv.projectId }, argv);
};
