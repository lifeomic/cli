'use strict';

const options = require('../common-yargs');

exports.command = 'surveys <command>';
exports.desc = 'Perform operations on surveys.';
exports.builder = yargs => {
    return options(yargs.commandDir('survey_cmds'));
};
exports.handler = function (argv) {};