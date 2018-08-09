'use strict';

exports.command = 'groups <command>';
exports.desc = 'Perform operations on groups.';
exports.builder = yargs => {
  return yargs.commandDir('groups_cmds');
};
exports.handler = function (argv) {};
