'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'cancel <taskId>';
exports.desc = 'Cancel a task';
exports.builder = yargs => {
  yargs.positional('taskId', {
    describe: 'The task ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const task = await read(argv);
  const response = await post(argv, `/v1/tasks/${argv.taskId}:cancel`, task);
  print(response.data, argv);
};
