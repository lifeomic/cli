'use strict';

const { del } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'delete-readgroup-set <readGroupSetId>';
exports.desc = 'Fetch readgroup set by ID <readGroupSetId>.';
exports.builder = yargs => {
  yargs.positional('readGroupSetId', {
    describe: 'The readgroup set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await del(argv, `/readgroupsets/${argv.readGroupSetId}`);
  print(response.data, argv);
};
