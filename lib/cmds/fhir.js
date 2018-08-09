'use strict';

const options = require('../common-yargs');

exports.command = 'fhir <command>';
exports.desc = 'Perform operations on FHIR resources.';
exports.builder = yargs => {
  return options(yargs.commandDir('fhir_cmds'));
};
exports.handler = function (argv) {};
