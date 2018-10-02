'use strict';

const options = require('../common-yargs');

exports.command = 'cohorts <command>';
exports.desc = 'Perform operations on cohorts.';
exports.builder = yargs => {
  return options(yargs.commandDir('cohorts_cmds'));
};
exports.handler = function (argv) {};
