'use strict';

const { get } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'get-rna-quantification-set <rnaQuantificationSetId>';
exports.desc = 'Fetch RNA quantification set by ID <rnaQuantificationSetId>.';
exports.builder = yargs => {
  yargs.positional('rnaQuantificationSetId', {
    describe: 'The RNA quantification set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/rnaquantificationsets/${argv.rnaQuantificationSetId}`);
  print(response.data, argv);
};
