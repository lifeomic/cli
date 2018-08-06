#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const debug = require('debug')('lo');

try {
  // Needed because the cognito library tries to fetch the user-agent from the browser
  global.navigator = () => null;

  require('./lib/cli').run();
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
      console.log(chalk.red(`Request failed with status: ${reason.response.status}, body:`));
      console.log(chalk.red(JSON.stringify(reason.response.data, null, 2)));
    }
  } else {
    console.error(chalk.red(reason));
  }
  process.exitCode = 1;
});
