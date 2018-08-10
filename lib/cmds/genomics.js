'use strict';

const options = require('../common-yargs');

exports.command = 'genomics <command>';
exports.desc = 'Perform operations on genomic resources.';
exports.builder = yargs => {
  return options(yargs.commandDir('genomics_cmds'));
};
exports.handler = function (argv) {};
