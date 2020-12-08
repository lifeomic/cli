'use strict';

const { del } = require('../../tool');
const print = require('../../print');

exports.command = 'delete <toolId>';
exports.desc = 'Delete tool by ID <toolId>.';
exports.builder = yargs => {
  yargs
    .positional('toolId', {
      describe: 'The tool ID.',
      type: 'string'
    })
    .option('tool-version', {
      describe: 'The specific version of the tool to delete',
      alias: 'v',
      type: 'string',
      demandOption: false
    });
};

exports.handler = async argv => {
  const toolId = argv.toolVersion ? `${argv.toolId}:${argv.toolVersion}` : argv.toolId;
  const response = await del(argv, `/trs/v2/tools/${toolId}`);
  print(response.data, argv);
};
