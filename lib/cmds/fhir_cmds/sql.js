'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'sql <statement>';
exports.desc = 'Use SQL to query FHIR resources';
exports.builder = yargs => {
  yargs.positional('statement', {
    describe: 'The SQL statement.',
    type: 'string'
  }).option('project', {
    describe: 'The project identifier',
    type: 'string'
  });
};

exports.handler = async argv => {
  const project = argv.project;
  const statement = argv.statement;
  const url = `/v1/fhir-search/projects/${project}/`;
  const options = { ...argv, ContentType: 'text/plain' };
  const response = await post(options, url, statement);
  const data =
    response.data.hits.hits
      .map(_ => _._source)
      .map(_ => {
        delete _.account;
        return _;
      });
  print(data, argv);
};
