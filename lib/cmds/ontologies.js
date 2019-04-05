'use strict';

const options = require('../common-yargs');

exports.command = 'ontologies <command>';
exports.desc = 'Perform operations on Ontologies.';

exports.builder = yargs => {
  return options(yargs.commandDir('ontologies_cmds'));
};

exports.handler = function (argv) {};
