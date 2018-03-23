'use strict';

const program = require('commander');
const querystring = require('querystring');
const { get, post, del, put } = require('../fhir');
const options = require('../common-options');
const print = require('../print');
const read = require('../read');
const config = require('../config');
const _ = require('lodash');

function getAccount (options) {
  const environment = config.getEnvironment();
  return options.account || config.get(`${environment}.defaults.account`);
}

async function search (type, query, options) {
  const account = getAccount(options);
  const result = [];
  const limit = options.limit || Number.MAX_SAFE_INTEGER;

  if (query) {
    query.pageSize = limit;
  } else {
    query = {pageSize: limit};
  }

  let url = `${account}/dstu3/${type}?${querystring.stringify(query)}`;

  while (url) {
    const response = await get(options, url);
    const data = response.data;
    result.push(...data.entry.map(x => x.resource));

    url = null;
    if (result.length < limit && data.link) {
      const next = data.link.find(x => x.relation === 'next');
      if (next) {
        url = next.url;
      }
    }
  }

  return result;
}

async function searchAndDelete (dataset, type, options) {
  const account = getAccount(options);
  const query = {
    '_tag': `http://lifeomic.com/fhir/dataset|${dataset}`,
    pageSize: 10
  };

  async function deleteResource (id) {
    const url = `${account}/dstu3/${type}/${id}`;
    await del(options, url);
    print({id, resourceType: type}, options);
  }

  let url = `${account}/dstu3/${type}?${querystring.stringify(query)}`;
  while (url) {
    const response = await get(options, url);
    const data = response.data;
    const resources = data.entry.map(x => x.resource);
    await Promise.all(resources.map(x => deleteResource(x.id)));

    url = null;
    if (data.link) {
      const next = data.link.find(x => x.relation === 'next');
      if (next) {
        url = next.url;
      }
    }
  }
}

options(program, 'fhir <type> [query]')
  .description('Search for FHIR resources.')
  .option('--limit <N>', 'Limit the result set to N')
  .option('--dataset <datasetID>', 'Filter by data set id')
  .action(async (type, query, options) => {
    if (query) {
      query = querystring.parse(query);
    } else {
      query = [];
    }

    if (options.dataset) {
      query['_tag'] = `http://lifeomic.com/fhir/dataset|${options.dataset}`;
    }

    const result = await search(type, query, options);
    print(result, options);
  });

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

function getUrlForResource (data, options) {
  if (!data.resourceType) {
    throw new Error('missing ResourceType on FHIR object');
  }

  const account = getAccount(options);
  const idUrlPart = data.id ? `/${data.id}` : '';
  return `${account}/dstu3/${data.resourceType}${idUrlPart}`;
}

async function createOrUpdate (data, options) {
  const url = getUrlForResource(data, options);
  setDataset(data, options);
  const methodToUse = data.id ? put : post;
  const response = await methodToUse(options, url, data);
  return {
    id: response.headers['location'] ? response.headers['location'].split('/').pop() : data.id,
    resourceType: data.resourceType
  };
}

async function collect (f, data, options) {
  if (Array.isArray(data)) {
    let result = [];
    const chunks = _.chunk(data, 10);
    for (const chunk of chunks) {
      result = result.concat(await Promise.all(chunk.map(resource => f(resource, options))));
    }
    return result;
  } else {
    return f(data, options);
  }
}

options(program, 'fhir-ingest')
  .description('Create or update one or more FHIR resources. The resources are read from stdin.')
  .option('--dataset <datasetID>', 'Tag the resource with the given datasetID')
  .action(async (options) => {
    const data = await read(options);
    const result = await collect(createOrUpdate, data, options);
    print(result, options);
  });

options(program, 'fhir-delete <type> <id>')
  .description('Delete a FHIR resource by type and id.')
  .action(async (type, id, options) => {
    const account = getAccount(options);
    const url = `${account}/dstu3/${type}/${id}`;
    await del(options, url);
    print({id, resourceType: type}, options);
  });

options(program, 'fhir-delete-all <dataset-id> <type>')
  .description('Delete all FHIR resources of a certain type in a dataset')
  .action(searchAndDelete);

options(program, 'fhir-get <type> <id>')
  .description('Fetch a FHIR resource by type and id.')
  .action(async (type, id, options) => {
    const account = getAccount(options);
    const url = `${account}/dstu3/${type}/${id}`;
    const response = await get(options, url);
    print(response.data, options);
  });

module.exports = program;
