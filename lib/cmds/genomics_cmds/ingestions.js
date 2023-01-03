'use strict';

const options = require('../../common-yargs');

exports.command = 'ingestions <command>';
exports.desc = 'Perform operations on genomic ingestions.';
exports.builder = yargs => {
  return options(yargs.commandDir('ingestions_cmds'));
};
exports.handler = function (argv) {};
