'use strict';

exports.command = 'accounts <command>';
exports.desc = 'Perform operations on accounts.';
exports.builder = yargs => {
  return yargs.commandDir('accounts_cmds');
};
exports.handler = function (argv) {};
