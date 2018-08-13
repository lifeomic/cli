'use strict';

const { post, getAccount } = require('../../fhir');
const print = require('../../print');
const stdin = require('../../stdin');
const _chunk = require('lodash/chunk');
const StreamValues = require('stream-json/streamers/StreamValues');

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

function fhirPost (options, resources) {
  const account = getAccount(options);
  const url = `${account}/dstu3`;
  resources.forEach(resource => setDataset(resource, options));
  const batch = {
    type: 'collection',
    resourceType: 'Bundle',
    entry: resources.map(resource => ({resource}))
  };
  return post(options, url, batch);
}

async function batchUpload (options, resources) {
  const chunks = _chunk(resources, options.chunk);
  for (const chunk of chunks) {
    const response = await fhirPost(options, chunk);
    print(response.data.entry, options);

    const failed = response.data.entry
      .filter(r => r.response.status !== '201' && r.response.status !== '200')
      .map(r => r.response.outcome);

    if (failed.length > 0) {
      throw new Error(`Error when ingesting resources: ${JSON.stringify(failed)}`);
    }
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
  let resources = [];

  const pipeline = stdin().pipe(StreamValues.withParser());

  return new Promise((resolve, reject) => {
    pipeline.on('data', async ({ value }) => {
      if (Array.isArray(value)) {
        resources = resources.concat(value);
      } else {
        resources.push(value);
      }

      if (resources.length >= argv.chunk) {
        try {
          const payload = resources.slice();
          resources = [];
          await batchUpload(argv, payload);
        } catch (err) {
          pipeline.destroy(err);
          reject(err);
        }
      }
    });

    pipeline.on('error', (err) => reject(err));
    pipeline.on('end', async () => {
      if (resources.length > 0) {
        try {
          const payload = resources.slice();
          resources = [];
          await batchUpload(argv, payload);
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
