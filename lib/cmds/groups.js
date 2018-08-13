'use strict';

const options = require('../common-yargs');

exports.command = 'groups <command>';
exports.desc = 'Perform operations on groups.';
exports.builder = yargs => {
  return options(yargs.commandDir('groups_cmds'));
};
exports.handler = function (argv) {};
