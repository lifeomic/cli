'use strict';

const { post, getAccount } = require('../../fhir');
const print = require('../../print');
const read = require('../../read');
const _chunk = require('lodash/chunk');

function setDataset (data, options) {
  if (options.dataset) {
    if (data.meta) {
      if (data.meta.tag) {
        data.meta.tag = data.meta.tag.filter(x => x.system !== 'http://lifeomic.com/fhir/dataset');
      } else {
        data.meta.tag = [];
      }
    } else {
      data.meta = {tag: []};
    }

    data.meta.tag.push({system: 'http://lifeomic.com/fhir/dataset', code: options.dataset});
  }
}

exports.command = 'ingest';
exports.desc = 'Create or update one or more FHIR resources. The resources are read from stdin.';
exports.builder = yargs => {
  yargs.option('chunk', {
    describe: 'Set the chunk size to use with batching the requests',
    type: 'integer',
    default: 100
  }).option('dataset', {
    describe: 'Tag the resource with the given dataset ID',
    type: 'string'
  });
};

exports.handler = async argv => {
  const account = getAccount(argv);
  const url = `${account}/dstu3`;
  const data = await read(argv);
  data.forEach(resource => setDataset(resource, argv));
  const chunks = _chunk(data, argv.chunk);
  const result = [];
  for (const chunk of chunks) {
    const batch = {
      type: 'collection',
      resourceType: 'Bundle',
      entry: chunk.map(resource => ({resource}))
    };
    const response = await post(argv, url, batch);
    result.push(...response.data.entry);
  }
  print(result, argv);
};
