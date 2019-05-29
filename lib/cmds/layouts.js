'use strict';

const options = require('../common-yargs');

exports.command = 'layouts <command>';
exports.desc = 'Perform operations on layouts.';
exports.builder = yargs => {
  return options(yargs.commandDir('layouts_cmds'));
};
exports.handler = function (argv) {};
