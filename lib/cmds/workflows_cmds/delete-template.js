'use strict';

const { del } = require('../../workflow');
const print = require('../../print');

exports.command = 'delete-template <templateId>';
exports.desc = 'Delete template by ID <templateId>.';
exports.builder = yargs => {
  yargs.positional('templateId', {
    describe: 'The template ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/workflows/templates/${argv.templateId}`);
  print(response.data, argv);
};
