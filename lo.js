#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const debug = require('debug')('lo');
const yargs = require('yargs');

function handleError (msg, err) {
  debug(`%j`, msg);
  if (err && err.response) {
    if (err.response.status === 401) {
      console.log(`Security credentials do not exist or have expired.  Use 'lo auth' to obtain new credentials.`);
    } else {
      console.log(chalk.red(`Request failed with status: ${err.response.status}, body:`));
      console.log(chalk.red(JSON.stringify(err.response.data, null, 2)));
    }
  } else if (msg) {
    console.error(chalk.red(msg));
  } else {
    console.error(chalk.red(err));
  }
  process.exitCode = 1;
}

// eslint-disable-next-line no-unused-expressions
yargs
  .fail(handleError)
  .commandDir('lib/cmds')
  .scriptName('lo')
  .demandCommand(1, 'You need at least one command before moving on')
  .recommendCommands()
  .help()
  .argv;

process.on('uncaughtException', function (err) {
  debug(`%j`, err);
  console.error(err);
  process.exitCode = 1;
});

process.on('unhandledRejection', function (reason, p) {
  handleError(reason.toString(), reason);
});
