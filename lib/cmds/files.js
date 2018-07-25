'use strict';

exports.command = 'files <command>';
exports.desc = 'Perform operations on files.';
exports.builder = yargs => {
  return yargs.commandDir('files_cmds');
};
exports.handler = function (argv) {};
