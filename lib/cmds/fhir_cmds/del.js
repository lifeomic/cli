'use strict';

const { del, getAccount } = require('../../fhir');
const print = require('../../print');

exports.command = 'delete <type> <id>';
exports.desc = 'Delete a FHIR resource by type <type> and id <id>.';
exports.builder = yargs => {
  yargs.positional('type', {
    describe: 'The FHIR resource type.',
    type: 'string'
  }).positional('id', {
    describe: 'The FHIR resource ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const account = getAccount(argv);
  const url = `${account}/dstu3/${argv.type}/${argv.id}`;
  await del(argv, url);
  print({id: argv.id, resourceType: argv.type}, argv);
};
