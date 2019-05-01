'use strict';

const { patch } = require('../../api');
const print = require('../../print');
const stdin = require('../../stdin');

const { chain } = require('stream-chain');

const { withParser } = require('stream-json/streamers/StreamValues');

const chunk = require('lodash/chunk');

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

  let buffer = [];
  const pipeline = chain([
    stdin(),
    withParser(),
    async (data) => {
      const value = data.value;

      if (Array.isArray(value)) {
        buffer = buffer.concat(value);
      } else {
        buffer.push(value);
      }

      if (buffer.length >= batch) {
        const partitions = chunk(buffer, batch); // split buffer into partitions of size batch
        for (const partition of partitions) {
          const response = await patch(argv, path, partition);
          print(response.data, argv);
        }
        buffer = []; // reset buffer
      }
    }
  ]);

  return new Promise((resolve, reject) => {
    pipeline.on('error', (err) => reject(err));
    pipeline.output.on('end', async () => {
      if (buffer.length > 0) {
        try {
          const payload = buffer.slice();
          buffer = [];
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
