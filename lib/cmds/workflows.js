'use strict';

const options = require('../common-yargs');

exports.command = 'workflows <command>';
exports.desc = 'Perform operations on workflow resources.';
exports.builder = yargs => {
  return options(yargs.commandDir('workflows_cmds'));
};
exports.handler = function (argv) {};
