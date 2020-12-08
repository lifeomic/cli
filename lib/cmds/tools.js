'use strict';

const options = require('../common-yargs');

exports.command = 'tools <command>';
exports.desc = 'Perform operations on tool resources.';
exports.builder = yargs => {
  return options(yargs.commandDir('tools_cmds'));
};
exports.handler = function (argv) {};
