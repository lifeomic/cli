'use strict';

const { del } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'delete-rna-quantification-set <rnaQuantificationSetId>';
exports.desc = 'Fetch RNA quantification set by ID <rnaQuantificationSetId>.';
exports.builder = yargs => {
  yargs.positional('rnaQuantificationSetId', {
    describe: 'The RNA quantification set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/rnaquantificationsets/${argv.rnaQuantificationSetId}`);
  print(response.data, argv);
};
