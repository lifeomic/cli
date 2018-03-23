'use strict';

const program = require('commander');
const glob = require('glob');
const path = require('path');
const version = require('../package.json').version;

exports.run = () => {
  program
    .version(version)
    .arguments('<command>')
    .usage('<command> [options]');

  const commands = glob.sync(path.join(__dirname, 'commands/*.js'));
  for (const command of commands) {
    // eslint-disable-next-line security/detect-non-literal-require
    require(command);
  }

  program.parse(process.argv);
};
