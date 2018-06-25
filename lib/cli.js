'use strict';

const program = require('commander');
const version = require('../package.json').version;
require('./commands');

exports.run = () => {
  program
    .version(version)
    .arguments('<command>')
    .usage('<command> [options]');

  program.parse(process.argv);
};
