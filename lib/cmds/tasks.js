'use strict';

const options = require('../common-yargs');

exports.command = 'tasks <command>';
exports.desc = 'Perform operations on tasks.';
exports.builder = yargs => {
  return options(yargs.commandDir('tasks_cmds'));
};
exports.handler = function (argv) {};
