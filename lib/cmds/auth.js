'use strict';

const { prompt } = require('inquirer');
const chalk = require('chalk');
const { copy } = require('copy-paste');
const config = require('../config');
const { login } = require('../oauth');

exports.command = 'auth';
exports.desc = 'Authenticate to the LifeOmic Platform to obtain an access token (Currently does not work for federated or social user account';
exports.builder = yargs => {
  yargs.option('set', {
    describe: 'Set the current access token',
    alias: 's'
  }).option('copy', {
    describe: 'Copies the current access token to the clipboard',
    alias: 'c'
  });
};

exports.handler = async argv => {
  const environment = config.getEnvironment();

  if (argv.set) {
    const answers = await prompt([{
      type: 'password',
      mask: '*',
      name: 'token',
      message: 'Access Token: '
    }]);
    config.set(`${environment}.tokens.accessToken`, answers.token);
    console.log(chalk.green(`Access token updated.`));
  } else if (argv.copy) {
    const accessToken = config.get(`${environment}.tokens.accessToken`);
    if (accessToken) {
      copy(accessToken, (err) => {
        if (err) {
          console.log(chalk.red(`Failed to copy access token to clipboard: ${err}`));
          process.exit(1);
        } else {
          console.log(chalk.green(`Access token copied to clipboard.`));
          // on linux the process hangs after copying to clipboard for
          // some reason, so this explicit exit call fixes that:
          process.exit(0);
        }
      });
    } else {
      console.log(chalk.red(`No access token present.  Run 'lo auth'.`));
      process.exit(1);
    }
  } else {
    if (config.get(`${environment}.defaults.useClientCredentials`)) {
      console.log(chalk.red(`auth command is not allowed for client credentials.`));
    } else {
      login();
    }
  }
};
