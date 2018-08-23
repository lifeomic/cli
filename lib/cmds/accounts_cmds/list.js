'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'list';
exports.desc = 'List accounts';
exports.builder = yargs => {};

exports.handler = async argv => {
  const response = await get(argv, `/v1/accounts`);
  print(response.data, argv);
};
