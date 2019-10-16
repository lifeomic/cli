'use strict';

const { get } = require('../../workflow');
const print = require('../../print');

exports.command = 'get-template <templateId>';
exports.desc = 'Fetch a template by ID <templateId>.';
exports.builder = yargs => {
  yargs.positional('templateId', {
    describe: 'The template set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/workflows/templates/${argv.templateId}`);
  print(response.data, argv);
};
