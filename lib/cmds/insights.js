'use strict';

const options = require('../common-yargs');

exports.command = 'insights <command>';
exports.desc = 'Perform operations on Insights.';
exports.builder = yargs => {
  return options(yargs.commandDir('insights_cmds'));
};
exports.handler = function (argv) {};
