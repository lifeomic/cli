'use strict';

const { post } = require('../../workflow');
const print = require('../../print');
const read = require('../../read');

exports.command = 'create-template';
exports.desc = 'Create a template';
exports.builder = yargs => {};

exports.handler = async argv => {
  const templates = await read(argv);
  const response = await post(argv, `/workflows/templates`, templates);
  print(response.data, argv);
};
