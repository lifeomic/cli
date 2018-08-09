'use strict';

exports.command = 'projects <command>';
exports.desc = 'Perform operations on projects.';
exports.builder = yargs => {
  return yargs.commandDir('projects_cmds');
};
exports.handler = function (argv) {};
