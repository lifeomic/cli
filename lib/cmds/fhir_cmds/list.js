'use strict';

const _concat = require('lodash/concat');
const querystring = require('querystring');
const { post, getAccount } = require('../../fhir');
const print = require('../../print');
const url = require('url');
const jmespath = require('jmespath');
const fs = require('fs');

exports.command = 'list <type>';
exports.desc = 'List FHIR resources by type <type> --project <projectId>.';
exports.builder = yargs => {
  yargs.positional('type', {
    describe: 'The FHIR resource type.',
    type: 'string'
  }).option('project', {
    describe: 'Filter by project ID',
    type: 'string',
    required: true
  }).option('query', {
    describe: 'Optional FHIR query',
    type: 'string'
  }).option('limit', {
    describe: 'Number of resources to return',
    type: 'integer',
    default: 1000
  }).option('csv', {
    describe: 'CSV Format Configuration file in json',
    type: 'string'
  });
};

async function search (type, query, options) {
  const account = getAccount(options);
  const limit = options.limit;

  const csvConfigFile = options.csv;

  const csvConfig = csvConfigFile != null ? JSON.parse(fs.readFileSync(csvConfigFile, 'UTF-8')) : null;

  if (csvConfig && csvConfig.header) {
    let header = '';
    csvConfig.fieldMaps.forEach(fieldMap => {
      if (header.length > 0) {
        header = header + ',';
      }
      header = header + fieldMap.columnName;
    });
    console.log(header);
  }

  if (query) {
    query.pageSize = limit;
  } else {
    query = {pageSize: limit};
  }

  const searchUrl = `${account}/dstu3/${type}/_search`;
  let allResults = [];
  while (true) {
    const response = await post(
      options,
      searchUrl,
      querystring.stringify(query),
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    );

    const data = response.data;
    const results = data.entry.map(x => x.resource);

    if (results.length > 0) {
      if (csvConfig) {
        const linesResult = formatResults(results, csvConfig, options);
        linesResult.forEach(line => {
          console.log(line);
        });
      } else if (options.jsonLine) {
        results.forEach(result => print(result, options));
      } else {
        allResults = allResults.concat(results);
      }
    }

    if (results.length < limit && data.link) {
      const next = data.link.find(x => x.relation === 'next');
      if (next) {
        const parsedUrl = url.parse(next.url, true);
        query = Object.assign(query, parsedUrl.query);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  if (!csvConfig && !options.jsonLine) {
    print(allResults, options);
  }
}

function formatResults (results, csvConfig, options) {
  const lines = [];
  results.forEach(result => {
    const fldD = csvConfig.fieldDelimiter;
    const valueD = csvConfig.valueDelimiter;
    const fields = [];
    csvConfig.fieldMaps.forEach(fieldMap => {
      const value = jmespath.search(result, fieldMap.jpath);
      if (value && value.length > 0) {
        fields.push(valueD + value + valueD);
      } else {
        fields.push('');
      }
    });
    let line = '';
    fields.forEach(field => {
      line = line + field + fldD;
    });
    lines.push(line.substring(0, line.length - 1));
  });
  return lines;
}

exports.handler = async argv => {
  if (argv.query) {
    argv.query = querystring.parse(argv.query);
  } else {
    argv.query = {};
  }

  if (argv.query['_tag']) {
    argv.query['_tag'] = _concat(argv.query['_tag'], `http://lifeomic.com/fhir/dataset|${argv.project}`);
  } else {
    argv.query['_tag'] = `http://lifeomic.com/fhir/dataset|${argv.project}`;
  }

  await search(argv.type, argv.query, argv);
};
