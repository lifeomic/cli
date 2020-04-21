'use strict';

const options = require('../common-yargs');

exports.command = 'data-lake <command>';
exports.desc = 'Perform operations on the analytics data lake.';
exports.builder = yargs => {
  return options(yargs.commandDir('data_lake_cmds'));
};
exports.handler = function (argv) {};
