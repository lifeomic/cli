'use strict';

const { put } = require('../../api');
const print = require('../../print');
const stdin = require('../../stdin');

const { chain } = require('stream-chain');

const { withParser } = require('stream-json/streamers/StreamValues');

exports.command = 'import <project>';
exports.desc = 'Import an ontology';
exports.builder = yargs => {
  yargs.positional('project', {
    describe: 'a project id',
    type: 'string'
  });
};

exports.handler = async argv => {
  const project = argv.project;
  const path = `/v1/terminology/projects/${project}/relationships/`;

  const pipeline = chain([
    stdin(),
    withParser(),
    async (data) => {
      let value = data.value;
      if (!Array.isArray(value)) {
        value = [ value ];
      }
      for (const payload of value) {
        const res = await put(argv, path, payload);
        print(res.data, argv);
      }
    }
  ]);
  pipeline.on('end', () => print('Finished processing', argv));
};
