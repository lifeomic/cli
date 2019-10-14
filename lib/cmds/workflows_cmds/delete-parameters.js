'use strict';

const { del } = require('../../workflow');
const print = require('../../print');

exports.command = 'delete-parameters <parameterId>';
exports.desc = 'Delete parameter set by ID <parameterId>.';
exports.builder = yargs => {
  yargs.positional('parameterId', {
    describe: 'The parameter set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/workflows/parameters/${argv.parameterId}`);
  print(response.data, argv);
};
