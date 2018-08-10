'use strict';

const { get } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'get-variant-set <variantSetId>';
exports.desc = 'Fetch variant set by ID <variantSetId>.';
exports.builder = yargs => {
  yargs.positional('variantSetId', {
    describe: 'The variant set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/variantsets/${argv.variantSetId}`);
  print(response.data, argv);
};
