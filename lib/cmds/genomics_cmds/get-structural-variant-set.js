'use strict';

const { get } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'get-structural-variant-set <structuralVariantSetId>';
exports.desc = 'Fetch structural variant set by ID <structuralVariantSetId>.';
exports.builder = yargs => {
  yargs.positional('structuralVariantSetId', {
    describe: 'The structural variant set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/fusionsets/${argv.structuralVariantSetId}`);
  print(response.data, argv);
};
