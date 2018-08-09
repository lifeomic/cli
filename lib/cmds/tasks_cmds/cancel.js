'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'cancel';
exports.desc = 'Cancel a task';
exports.builder = yargs => {};

exports.handler = async argv => {
  const task = await read(argv);
  const response = await post(argv, `/v1/tasks/${argv.taskId}:cancel`, task);
  print(response.data, argv);
};
