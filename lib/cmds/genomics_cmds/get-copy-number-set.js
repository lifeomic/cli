'use strict';

const { get } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'get-copy-number-set <copyNumberSetId>';
exports.desc = 'Fetch copy number set by ID <copyNumberSetId>.';
exports.builder = yargs => {
  yargs.positional('copyNumberSetId', {
    describe: 'The copy number set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/copynumbersets/${argv.copyNumberSetId}`);
  print(response.data, argv);
};
