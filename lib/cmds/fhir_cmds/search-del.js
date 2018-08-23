'use strict';

const querystring = require('querystring');
const { del, getAccount } = require('../../fhir');
const chalk = require('chalk');

exports.command = 'search-delete <type> <project>';
exports.desc = 'Delete all FHIR resources of a certain type in a project that match an optional query';
exports.builder = yargs => {
  yargs.positional('type', {
    describe: 'The FHIR resource type.',
    type: 'string'
  }).positional('project', {
    describe: 'The ID of the project to delete from.',
    type: 'string'
  }).option('query', {
    describe: 'The FHIR query',
    type: 'string'
  });
};

exports.handler = async argv => {
  if (argv.query) {
    argv.query = querystring.parse(argv.query);
  } else {
    argv.query = {};
  }

  argv.query['_tag'] = `http://lifeomic.com/fhir/dataset|${argv.project}`;

  const account = getAccount(argv);
  const url = `${account}/dstu3/${argv.type}?${querystring.stringify(argv.query)}`;
  await del(argv, url);

  console.log(chalk.green(`Deleted resources`));
};
