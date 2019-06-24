'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create-ontology-import <datasetId>';
exports.desc = 'Create a task to ingest an Ontology';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('file-id', {
    describe: 'The ID of the uploaded ontology file',
    alias: 'f',
    type: 'string',
    demandOption: true
  }).option('type', {
    describe: 'The type of the ontology to import.',
    alias: 'o',
    choices: ['gsea'],
    type: 'string',
    demandOption: false
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/tasks/ontology/import`, {
    fileId: argv.fileId,
    datasetId: argv.datasetId,
    type: argv.type
  });
  print(response.data, argv);
};
