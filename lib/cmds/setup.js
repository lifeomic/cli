'use strict';

const { prompt } = require('inquirer');
const chalk = require('chalk');
const config = require('../config');

exports.command = 'setup';
exports.desc = 'Sets default values for the LifeOmic CLI.';
exports.builder = {};

exports.handler = async argv => {
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
      name: 'useApiKey',
      message: 'Use API key for authentication?',
      default: a => config.get(`${a.environment}.defaults.apiKey`) !== undefined
    },
    {
      type: 'input',
      name: 'apiKey',
      message: 'API Key: ',
      when: a => a.useApiKey,
      default: a => config.get(`${a.environment}.defaults.apiKey`)
    },
    {
      type: 'confirm',
      name: 'useAuthClient',
      message: 'Use custom client for authentication?',
      when: a => !a.useApiKey,
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
      when: a => !a.useApiKey && !a.useAuthClient,
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
    },
    {
      type: 'confirm',
      name: 'useHttpProxy',
      message: 'Use an HTTP Proxy?',
      default: a => config.get(`${a.environment}.defaults.useHttpProxy`) !== undefined
    },
    {
      type: 'input',
      name: 'httpProxyHost',
      message: 'Http ProxyHost: ',
      when: a => a.useHttpProxy,
      default: a => config.get(`${a.environment}.defaults.httpProxyHost`)
    },
    {
      type: 'input',
      name: 'httpProxyPort',
      message: 'Http ProxyPort: ',
      when: a => a.useHttpProxy,
      default: a => config.get(`${a.environment}.defaults.httpProxyPort`)
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

  config.set(`${answers.environment}.defaults.useApiKey`, answers.useApiKey);
  if (answers.apiKey) {
    config.set(`${answers.environment}.defaults.apiKey`, answers.apiKey);
  } else {
    config.delete(`${answers.environment}.defaults.apiKey`);
  }

  config.set(`${answers.environment}.defaults.useHttpProxy`, answers.useHttpProxy);
  if (answers.useHttpProxy) {
    config.set(`${answers.environment}.defaults.httpProxyHost`, answers.httpProxyHost);
    config.set(`${answers.environment}.defaults.httpProxyPort`, answers.httpProxyPort);
  }
  console.log(chalk.green(`Default settings have been saved.`));
};
