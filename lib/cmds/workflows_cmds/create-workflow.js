'use strict';

const { post } = require('../../workflow');
const print = require('../../print');
const read = require('../../read');

exports.command = 'create-workflow';
exports.desc = 'Create and run a workflow';
exports.builder = yargs => {};

exports.handler = async argv => {
  const workflow = await read(argv);
  const response = await post(argv, `/workflows`, workflow);
  print(response.data, argv);
};
