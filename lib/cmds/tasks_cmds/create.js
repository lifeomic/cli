'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'create';
exports.desc = 'Create a task';
exports.builder = yargs => {};

exports.handler = async argv => {
  const task = await read(argv);
  const response = await post(argv, `/v1/tasks`, task);
  print(response.data, argv);
};
