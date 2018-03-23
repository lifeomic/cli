'use strict';

const { prompt } = require('inquirer');
const chalk = require('chalk');
const program = require('commander');
const config = require('../config');
const print = require('../print');

program
  .command('setup')
  .option('-l, --list', 'List current settings')
  .description('Sets default values for the LifeOmic CLI.')
  .action(async (options) => {
    if (options.list) {
      const environment = config.getEnvironment();
      const defaults = config.get(`${environment}.defaults`);
      if (defaults.clientSecret) {
        defaults.clientSecret = '*********************';
      }
      if (defaults.authClientSecret) {
        defaults.authClientSecret = '*********************';
      }
      defaults.environment = environment;
      print(defaults, options);
    } else {
      const questions = [
        {
          type: 'list',
          name: 'environment',
          message: 'Pick a LifeOmic environment',
          choices: ['dev', 'prod-us'],
          default: config.get(`defaults.environment`)
        },
        {
          type: 'input',
          name: 'account',
          message: 'Specify a default LifeOmic account to use: ',
          default: a => config.get(`${a.environment}.defaults.account`)
        },
        {
          type: 'confirm',
          name: 'useAuthClient',
          message: 'Use custom client for authentication?',
          default: a => config.get(`${a.environment}.defaults.authClientId`) !== undefined
        },
        {
          type: 'input',
          name: 'authClientId',
          message: 'Client ID: ',
          when: a => a.useAuthClient,
          default: a => config.get(`${a.environment}.defaults.authClientId`)
        },
        {
          type: 'password',
          name: 'authClientSecret',
          message: 'Client Secret: ',
          mask: '*',
          when: a => a.useAuthClient,
          default: a => config.get(`${a.environment}.defaults.authClientSecret`)
        },
        {
          type: 'confirm',
          name: 'useClientCredentials',
          message: 'Use client credentials for authentication?',
          default: a => config.get(`${a.environment}.defaults.clientId`) !== undefined
        },
        {
          type: 'input',
          name: 'clientId',
          message: 'Client ID: ',
          when: a => a.useClientCredentials,
          default: a => config.get(`${a.environment}.defaults.clientId`)
        },
        {
          type: 'password',
          name: 'clientSecret',
          message: 'Client Secret: ',
          mask: '*',
          when: a => a.useClientCredentials,
          default: a => config.get(`${a.environment}.defaults.clientSecret`)
        }
      ];

      const answers = await prompt(questions);
      config.set(`defaults.environment`, answers.environment);
      config.set(`${answers.environment}.defaults.account`, answers.account);
      config.set(`${answers.environment}.defaults.useClientCredentials`, answers.useClientCredentials);
      if (answers.clientId) {
        config.set(`${answers.environment}.defaults.clientId`, answers.clientId);
      }
      if (answers.clientSecret) {
        // Provide a little obfuscation for the client secret
        config.set(`${answers.environment}.defaults.clientSecret`, Buffer.from(answers.clientSecret).toString('base64'));
      }

      config.set(`${answers.environment}.defaults.useAuthClient`, answers.useAuthClient);
      if (answers.authClientId) {
        config.set(`${answers.environment}.defaults.authClientId`, answers.authClientId);
      }
      if (answers.authClientSecret) {
        // Provide a little obfuscation for the client secret
        config.set(`${answers.environment}.defaults.authClientSecret`, Buffer.from(answers.authClientSecret).toString('base64'));
      }
      console.log(chalk.green(`Default settings have been saved.`));
    }
  });
