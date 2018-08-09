'use strict';

const options = require('../common-yargs');

exports.command = 'projects <command>';
exports.desc = 'Perform operations on projects.';
exports.builder = yargs => {
  return options(yargs.commandDir('projects_cmds'));
};
exports.handler = function (argv) {};
