'use strict';

const { post } = require('../../ga4gh');
const print = require('../../print');

exports.command = 'create-rna-quantification-set <datasetId>';
exports.desc = 'Create RNA quantification resources by indexing a RGEL file.';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('name', {
    describe: 'The resource name',
    demandOption: true,
    alias: 'n',
    type: 'string'
  }).option('rgel-file', {
    describe: 'The ID of the RGEL file to index',
    alias: 'r',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, '/rnaquantificationsets', {
    datasetId: argv.datasetId,
    fileId: argv.rgelFile,
    name: argv.name
  });
  print(response.data, argv);
};
