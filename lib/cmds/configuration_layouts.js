'use strict';

const options = require('../common-yargs');

exports.command = 'configuration_layouts <command>';
exports.desc = 'Perform operations on configuration_layouts.';
exports.builder = yargs => {
  return options(yargs.commandDir('configuration_layouts_cmds'));
};
exports.handler = function (argv) {};
