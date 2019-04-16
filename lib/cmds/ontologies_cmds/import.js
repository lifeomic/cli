'use strict';

const { patch } = require('../../api');
const print = require('../../print');
const stdin = require('../../stdin');

const { chain } = require('stream-chain');

const { withParser } = require('stream-json/streamers/StreamValues');

exports.command = 'import <project>';
exports.desc = 'Import an ontology';
exports.builder = yargs => {
  yargs.positional('project', {
    describe: 'A project id',
    type: 'string'
  });
  yargs.option('batch-size', {
    describe: 'The number of samples to process per request',
    type: 'integer',
    default: 100
  });
};

exports.handler = async argv => {
  const batch = argv.batchSize;
  const project = argv.project;
  const path = `/v1/terminology/projects/${project}/relationships/`;

  let values = [];
  const pipeline = chain([
    stdin(),
    withParser(),
    async (data) => {
      const value = data.value;

      if (!Array.isArray(value)) {
        values = values.concat(value);
      } else {
        values.push(value);
      }

      if (values.length >= batch) {
        const payload = values.slice();
        values = [];
        const response = await patch(argv, path, payload);
        print(response.data, argv);
      }
    }
  ]);

  return new Promise((resolve, reject) => {
    pipeline.on('error', (err) => reject(err));
    pipeline.output.on('end', async () => {
      if (values.length > 0) {
        try {
          const payload = values.slice();
          values = [];
          const response = await patch(argv, path, payload);
          print(response.data, argv);
        } catch (err) {
          pipeline.destroy(err);
          reject(err);
          return;
        }
      }
      resolve();
    });
  });
};
