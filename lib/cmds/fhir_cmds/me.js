'use strict';

const { get, getAccount } = require('../../fhir');
const print = require('../../print');

exports.command = 'me';
exports.desc = 'Fetch your own Patient records, if any.';
exports.builder = yargs => { };

exports.handler = async argv => {
  const account = getAccount(argv);
  const url = `/${account}/dstu3/$me`;
  const response = await get(argv, url);
  print(response.data, argv);
};
