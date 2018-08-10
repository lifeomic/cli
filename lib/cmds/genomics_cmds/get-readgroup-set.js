'use strict';

const { get } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'get-readgroup-set <readgroupSetId>';
exports.desc = 'Fetch readgroup set by ID <readgroupSetId>.';
exports.builder = yargs => {
  yargs.positional('readgroupSetId', {
    describe: 'The readgroup set ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/readgroupsets/${argv.readgroupSetId}`);
  print(response.data, argv);
};
