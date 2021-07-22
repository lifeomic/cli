'use strict';

const { prompt } = require('inquirer');
const chalk = require('chalk');
const { copy } = require('copy-paste');
const config = require('../config');
const { login, tokenPost } = require('../oauth');

exports.command = 'auth';
exports.desc = 'Authenticate to the LifeOmic Platform to obtain an access token.';
exports.builder = yargs => {
  yargs.option('set', {
    describe: 'Set the current access token',
    alias: 's'
  }).option('copy', {
    describe: 'Copies the current access token to the clipboard',
    alias: 'c'
  }).option('refresh', {
    describe: 'Refresh the current access token',
    alias: 'r'
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
  } else if (argv.refresh) {
    const refreshToken = config.get(`${environment}.tokens.refreshToken`);
    if (!refreshToken) {
      throw new Error("Refresh token not set. Run 'lo auth' to obtain one.");
    }
    console.log(chalk.green('Refreshing token'));
    const response = await tokenPost(environment, null, {
      grant_type: 'refresh_token',
      client_id: config.get(`${environment}.defaults.useAuthClient`) ? config.get(`${environment}.defaults.authClientId`) : config.get(environment).clientId,
      refresh_token: refreshToken
    });
    const accessToken = response.data.access_token;
    config.set(`${environment}.tokens.accessToken`, accessToken);
    console.log(chalk.green('Access token refreshed'));
  } else {
    if (config.get(`${environment}.defaults.useClientCredentials`) || config.get(`${environment}.defaults.useApiKey`)) {
      console.log(chalk.red(`auth command is not allowed for client credentials or API key.`));
    } else {
      login();
    }
  }
};
