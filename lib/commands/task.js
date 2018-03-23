'use strict';

const program = require('commander');
const querystring = require('querystring');
const { get, post } = require('../api');
const options = require('../common-options');
const print = require('../print');
const read = require('../read');
const formatPage = require('../formatPage');

const TASKS_URL = '/v1/tasks';

options(program, 'tasks <datasetId>')
  .description('List tasks')
  .option('--prefix <prefix>', 'Filter tasks where the name begins with a prefix')
  .option('--state <state>', 'Filter tasks by state')
  .option('--view <view>', 'Specify MINIMAL to just get task state')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .action(async (datasetId, options) => {
    const opts = {
      pageSize: options.pageSize,
      nextPageToken: options.nextPageToken,
      datasetId: datasetId
    };

    if (options.prefix) {
      opts.name = options.prefix;
    }

    if (options.state) {
      opts.state = options.state;
    }

    if (options.view) {
      opts.view = options.view;
    }

    const response = await get(options, `${TASKS_URL}?${querystring.stringify(opts)}`);
    print(formatPage(response.data), options);
  });

options(program, 'tasks-create')
  .description('Create a new task. The task is read from stdin.')
  .action(async (options) => {
    const task = await read(options);
    const response = await post(options, TASKS_URL, task);
    print(response.data, options);
  });

options(program, 'tasks-get <taskId>')
  .description('Get a task')
  .action(async (taskId, options) => {
    const response = await get(options, `${TASKS_URL}/${taskId}`);
    print(response.data, options);
  });

options(program, 'tasks-cancel <taskId>')
  .description('Cancel a task')
  .action(async (taskId, options) => {
    const task = await read(options);
    const response = await post(options, `${TASKS_URL}/${taskId}:cancel`, task);
    print(response.data, options);
  });

module.exports = program;
