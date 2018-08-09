'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'create';
exports.desc = 'Create a policy.  The policy is read from stdin';
exports.builder = yargs => {};

exports.handler = async argv => {
  const policy = await read(argv);
  const response = await post(argv, `/v1/policies`, policy);
  print(response.data, argv);
};
