'use strict';

const options = require('../common-yargs');

exports.command = 'policies <command>';
exports.desc = 'Perform operations on policies.';
exports.builder = yargs => {
  return options(yargs.commandDir('policies_cmds'));
};
exports.handler = function (argv) {};
