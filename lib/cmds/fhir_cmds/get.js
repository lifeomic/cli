'use strict';

const { get, getAccount } = require('../../fhir');
const print = require('../../print');

exports.command = 'get <type> <id>';
exports.desc = 'Fetch a FHIR resource by type <type> and id <id>.';
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
  const url = `/${account}/dstu3/${argv.type}/${argv.id}`;
  const response = await get(argv, url);
  console.log(response.data);
  print(response.data, argv);
};
