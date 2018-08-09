'use strict';

const { post } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');

exports.command = 'create <name>';
exports.desc = 'Create a project with <name>';
exports.builder = yargs => {
  yargs.positional('name', {
    describe: 'The project name.',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/projects`, { name: argv.name });
  print(formatPage(response.data), argv);
};
