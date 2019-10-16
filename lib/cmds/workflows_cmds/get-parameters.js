'use strict';

const { get } = require('../../workflow');
const print = require('../../print');

exports.command = 'get-parameters <parameterId>';
exports.desc = 'Fetch a parameter set by ID <parameterId>.';
exports.builder = yargs => {
  yargs.positional('parameterId', {
    describe: 'The parameter set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/workflows/parameters/${argv.parameterId}`);
  print(response.data, argv);
};
