'use strict';

const { del } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'delete-copy-number-set <copyNumberSetId>';
exports.desc = 'Delete copy number set by ID <copyNumberSetId>.';
exports.builder = yargs => {
  yargs.positional('copyNumberSetId', {
    describe: 'The copy number set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/copynumbersets/${argv.copyNumberSetId}`);
  print(response.data, argv);
};
