'use strict';

const querystring = require('querystring');
const { post, getAccount } = require('../../fhir');
const print = require('../../print');
const url = require('url');

exports.command = 'list <type>';
exports.desc = 'List FHIR resources by type <type>.';
exports.builder = yargs => {
  yargs.positional('type', {
    describe: 'The FHIR resource type.',
    type: 'string'
  }).option('project', {
    describe: 'Filter by project ID',
    type: 'string'
  }).option('query', {
    describe: 'Optional FHIR query',
    type: 'string'
  }).option('limit', {
    describe: 'Number of resources to return',
    type: 'integer',
    default: 1000
  }).option('logResults', {
    describe: 'Log results as received not after search completes. Better for large result sets.',
    type: 'boolean',
    default: false
  });
};

async function search (type, query, options) {
  const account = getAccount(options);
  const result = [];
  const limit = options.limit;
  const logResults = options.logResults;

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
    if ( logResults ) {
      print(...data.entry.map(x => x.resource), options);
    } else {
      result.push(...data.entry.map(x => x.resource));
    }

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

exports.handler = async argv => {
  if (argv.query) {
    argv.query = querystring.parse(argv.query);
  } else {
    argv.query = {};
  }

  if (argv.project) {
    argv.query['_tag'] = `http://lifeomic.com/fhir/dataset|${argv.project}`;
  }

  const result = await search(argv.type, argv.query, argv);
  print(result, argv);
};
