'use strict';

const { post } = require('../../workflow');
const print = require('../../print');
const read = require('../../read');

exports.command = 'create-parameters';
exports.desc = 'Create a parameter set';
exports.builder = yargs => {};

exports.handler = async argv => {
  const parameters = await read(argv);
  const response = await post(argv, `/workflows/parameters`, parameters);
  print(response.data, argv);
};
