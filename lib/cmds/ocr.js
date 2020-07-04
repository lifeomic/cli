'use strict';

const options = require('../common-yargs');

exports.command = 'ocr <command>';
exports.desc = 'Perform operations on OCR.';
exports.builder = yargs => {
  return options(yargs.commandDir('ocr_cmds'));
};
exports.handler = function (argv) {};
