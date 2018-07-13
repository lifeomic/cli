'use strict';

const chalk = require('chalk');
const program = require('commander');
const querystring = require('querystring');
const { get, post, del } = require('../fhir');
const options = require('../common-options');
const print = require('../print');
const read = require('../read');
const config = require('../config');
const chunk = require('lodash/chunk');
const url = require('url');

function getAccount (options) {
  const environment = config.getEnvironment();
  return options.account || config.get(`${environment}.defaults.account`);
}

async function search (type, query, options) {
  const account = getAccount(options);
  const result = [];
  const limit = options.limit;

  if (query) {
    query.pageSize = limit;
  } else {
    query = {pageSize: limit};
  }

  const searchUrl = `${account}/dstu3/${type}/_search`;
  while (true) {
    const response = await post(
      options,
      searchUrl,
      querystring.stringify(query),
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    );

    const data = response.data;
    result.push(...data.entry.map(x => x.resource));

    if (result.length < limit && data.link) {
      const next = data.link.find(x => x.relation === 'next');
      if (next) {
        const parsedUrl = url.parse(next.url, true);
        query = Object.assign(query, parsedUrl.query);
      } else {
        return result;
      }
    } else {
      return result;
    }
  }
}

options(program, 'fhir <type> [query]')
  .description('Search for FHIR resources.')
  .option('--limit <N>', 'Limit the result set to N', 1000)
  .option('--dataset <datasetID>', 'Filter by data set id')
  .action(async (type, query, options) => {
    if (query) {
      query = querystring.parse(query);
    } else {
      query = {};
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

options(program, 'fhir-ingest')
  .description('Create or update one or more FHIR resources. The resources are read from stdin.')
  .option('--dataset <datasetID>', 'Tag the resource with the given datasetID')
  .option('--chunk <chunkSize>', 'Set the chunk size to use with batching the requests', 100)
  .action(async (options) => {
    const account = getAccount(options);
    const url = `${account}/dstu3`;
    const data = await read(options);
    data.forEach(resource => setDataset(resource, options));
    const chunks = chunk(data, options.chunk);
    const result = [];
    for (const chunk of chunks) {
      const batch = {
        type: 'collection',
        resourceType: 'Bundle',
        entry: chunk.map(resource => ({resource}))
      };
      const response = await post(options, url, batch);
      result.push(...response.data.entry);
    }
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

options(program, 'fhir-search-delete <type> [query]')
  .option('--dataset <datasetID>', 'Filter by data set id')
  .description('Delete all FHIR resources of a certain type that match an optional query')
  .action(async (type, query, options) => {
    if (query) {
      query = querystring.parse(query);
    } else {
      query = {};
    }

    if (options.dataset) {
      query['_tag'] = `http://lifeomic.com/fhir/dataset|${options.dataset}`;
    }

    const account = getAccount(options);
    const url = `${account}/dstu3/${type}?${querystring.stringify(query)}`;
    await del(options, url);

    console.log(chalk.green(`Deleted resources`));
  });

options(program, 'fhir-get <type> <id>')
  .description('Fetch a FHIR resource by type and id.')
  .action(async (type, id, options) => {
    const account = getAccount(options);
    const url = `${account}/dstu3/${type}/${id}`;
    const response = await get(options, url);
    print(response.data, options);
  });

module.exports = program;
