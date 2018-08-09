'use strict';

const options = require('../common-yargs');

exports.command = 'api-keys <command>';
exports.desc = 'Perform operations on API keys.';
exports.builder = yargs => {
  return options(yargs.commandDir('api_keys_cmds'));
};
exports.handler = function (argv) {};
