#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const debug = require('debug')('lo');
const yargs = require('yargs');

try {
  // Needed because the cognito library tries to fetch the user-agent from the browser
  global.navigator = () => null;

  // eslint-disable-next-line no-unused-expressions
  yargs.commandDir('lib/cmds')
    .scriptName('lo')
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;
} catch (err) {
  debug(`%j`, err);
  console.error(`\n  ${err.message}`);
  process.exitCode = 1;
}

process.on('uncaughtException', function (err) {
  debug(`%j`, err);
  console.error(err);
  process.exitCode = 1;
});

process.on('unhandledRejection', function (reason, p) {
  debug(`%j`, reason);
  if (reason.response) {
    if (reason.response.status === 401) {
      console.log(`Security credentials do not exist or have expired.  Use 'lo auth' to obtain new credentials.`);
    } else {
      console.log(chalk.red(JSON.stringify(reason.response.data, null, 2)));
    }
  } else {
    console.error(chalk.red(reason.toString()));
  }
  process.exitCode = 1;
});
