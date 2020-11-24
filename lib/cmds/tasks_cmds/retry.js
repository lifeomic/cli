'use strict';

const { post } = require('../../api');
const print = require('../../print');
const read = require('../../read');

exports.command = 'retry <taskId>';
exports.desc = 'Retry a task';
exports.builder = yargs => {
  yargs.positional('taskId', {
    describe: 'The task ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const task = await read(argv);
  const response = await post(argv, `/v1/tasks/${argv.taskId}:clone`, task);
  print(response.data, argv);
};
