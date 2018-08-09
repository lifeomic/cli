'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'get <taskId>';
exports.desc = 'Fetch tasks information by <taskId>';
exports.builder = yargs => {
  yargs.positional('taskId', {
    describe: 'The task ID.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/tasks/${argv.taskId}`);
  print(response.data, argv);
};
