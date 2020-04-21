'use strict';

const { del } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'delete-structural-variant-set <structuralVariantSetId>';
exports.desc = 'Delete structural variant set by ID <structuralVariantSetId>.';
exports.builder = yargs => {
  yargs.positional('structuralVariantSetId', {
    describe: 'The structural variant set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/fusionsets/${argv.structuralVariantSetId}`);
  print(response.data, argv);
};
