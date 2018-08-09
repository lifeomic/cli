'use strict';

exports.command = 'api-keys <command>';
exports.desc = 'Perform operations on API keys.';
exports.builder = yargs => {
  return yargs.commandDir('api_keys_cmds');
};
exports.handler = function (argv) {};
