'use strict';

const { del } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'delete-variant-set <variantSetId>';
exports.desc = 'Delete variant set by ID <variantSetId>.';
exports.builder = yargs => {
  yargs.positional('variantSetId', {
    describe: 'The variant set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/variantsets/${argv.variantSetId}`);
  print(response.data, argv);
};
