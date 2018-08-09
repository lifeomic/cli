'use strict';

const querystring = require('querystring');
const { del, getAccount } = require('../../fhir');
const chalk = require('chalk');

exports.command = 'search-delete <type>';
exports.desc = 'Delete all FHIR resources of a certain type that match an optional query';
exports.builder = yargs => {
  yargs.positional('type', {
    describe: 'The FHIR resource type.',
    type: 'string'
  }).option('query', {
    describe: 'The FHIR query',
    type: 'string'
  }).option('project', {
    describe: 'Filter by project ID',
    type: 'string'
  });
};

exports.handler = async argv => {
  if (argv.query) {
    argv.query = querystring.parse(argv.query);
  } else {
    argv.query = {};
  }

  if (argv.project) {
    argv.query['_tag'] = `http://lifeomic.com/fhir/dataset|${argv.project}`;
  }

  const account = getAccount(argv);
  const url = `${account}/dstu3/${argv.type}?${querystring.stringify(argv.query)}`;
  await del(argv, url);

  console.log(chalk.green(`Deleted resources`));
};
