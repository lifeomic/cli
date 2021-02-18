'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');

const getSuggestions = async (argv, nextPageToken) => {
  const suggestionsQuery = querystring.stringify({
    'pageSize': 25,
    nextPageToken
  });
  const suggestionsUrl = `/v1/ocr/fhir/projects/${argv.projectId}/documentReferences/${argv.documentId}/suggestions?${suggestionsQuery}`;
  const response = await get(argv, suggestionsUrl);
  return response;
};

const loadAnalyzeSuggestions = async (argv) => {
  const results = [];
  let nextPageToken = '';
  do {
    const response = await getSuggestions(argv, nextPageToken);
    const { records, nextPageToken: responseToken } = response.data || {};

    results.push(...(records || []));
    nextPageToken = responseToken
      ? JSON.stringify(nextPageToken)
      : undefined;
  } while (nextPageToken);

  return results;
};

exports.command = 'get-suggestions <projectId> <documentId>';
exports.desc = 'Fetch suggestions from the document <documentId> in project <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project this document is in.',
    type: 'string'
  }).positional('documentId', {
    describe: 'The ID of the document to fetch suggestions from.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const suggestions = await loadAnalyzeSuggestions(argv);
  print(suggestions, argv);
};
