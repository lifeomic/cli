'use strict';

const { prompt } = require('inquirer');
const chalk = require('chalk');
const config = require('../config');

exports.command = 'setup';
exports.desc = 'Sets default values for the LifeOmic CLI. If not supplied, CLI will prompt for them.';
exports.builder = yargs => {
  yargs.option('environment', {
    describe: 'Specify LifeOmic environment',
    alias: 'e',
    type: 'string'
  }).option('account', {
    describe: 'Specify a default organization account id to use',
    alias: 'a',
    type: 'string'
  }).option('apiKey', {
    describe: 'API Key',
    alias: 'api',
    type: 'string'
  }).group(
    'apiKey', 'Use API key'
  ).option('authClientId', {
    describe: 'Custom auth client ID',
    type: 'string'
  }).option('authClientSecret', {
    describe: 'Custom auth client Secret',
    type: 'string'
  }).group(
    ['authClientId', 'authClientSecret'], 'Use custom authentication'
  ).option('clientId', {
    describe: 'Client credentials client ID',
    type: 'string'
  }).option('clientSecret', {
    describe: 'Client credentials client secret',
    type: 'string'
  }).group(
    ['clientId', 'clientSecret'], 'Use client credentials'
  );
};

exports.handler = async argv => {
  const questions = [
    {
      type: 'list',
      name: 'environment',
      message: 'Pick a LifeOmic environment',
      choices: config.get(`dev.clientId`) ? ['dev', 'prod-us', 'prod-us-fed'] : ['prod-us', 'prod-us-fed'],
      default: config.get(`defaults.environment`),
      when: a => argv.environment === undefined
    },
    {
      type: 'input',
      name: 'account',
      message: 'Specify a default organization account id to use: ',
      validate: input => input.match(/^([a-z0-9]{1,16})$/) ? true : `${input} is not a valid account id`,
      default: a => config.get(`${a.environment}.defaults.account`),
      when: a => argv.account === undefined
    },
    {
      type: 'confirm',
      name: 'useApiKey',
      message: 'Use API key for authentication?',
      default: a => config.get(`${a.environment}.defaults.apiKey`) !== undefined,
      when: a => argv.apiKey === undefined && argv.authClientId === undefined && argv.clientId === undefined
    },
    {
      type: 'input',
      name: 'apiKey',
      message: 'API Key: ',
      default: a => config.get(`${a.environment}.defaults.apiKey`),
      when: a => a.useApiKey && argv.apiKey === undefined && argv.authClientId === undefined && argv.clientId === undefined
    },
    {
      type: 'confirm',
      name: 'useAuthClient',
      message: 'Use custom client for authentication?',
      default: a => config.get(`${a.environment}.defaults.authClientId`) !== undefined,
      when: a => !a.useApiKey && argv.apiKey === undefined && argv.authClientId === undefined && argv.clientId === undefined
    },
    {
      type: 'input',
      name: 'authClientId',
      message: 'Client ID: ',
      default: a => config.get(`${a.environment}.defaults.authClientId`),
      when: a => a.useAuthClient && argv.apiKey === undefined && argv.authClientId === undefined && argv.clientId === undefined
    },
    {
      type: 'password',
      name: 'authClientSecret',
      message: 'Client Secret: ',
      mask: '*',
      default: a => config.get(`${a.environment}.defaults.authClientSecret`),
      when: a => a.useAuthClient && argv.apiKey === undefined && argv.authClientId === undefined && argv.clientId === undefined
    },
    {
      type: 'confirm',
      name: 'useClientCredentials',
      message: 'Use client credentials for authentication?',
      default: a => config.get(`${a.environment}.defaults.clientId`) !== undefined,
      when: a => !a.useApiKey && !a.useAuthClient && argv.apiKey === undefined && argv.authClientId === undefined && argv.clientId === undefined
    },
    {
      type: 'input',
      name: 'clientId',
      message: 'Client ID: ',
      default: a => config.get(`${a.environment}.defaults.clientId`),
      when: a => a.useClientCredentials && argv.apiKey === undefined && argv.authClientId === undefined && argv.clientId === undefined
    },
    {
      type: 'password',
      name: 'clientSecret',
      message: 'Client Secret: ',
      mask: '*',
      default: a => config.get(`${a.environment}.defaults.clientSecret`),
      when: a => a.useClientCredentials && argv.apiKey === undefined && argv.authClientId === undefined && argv.clientId === undefined
    }
  ];

  const answers = await prompt(questions);

  const environment = argv.environment || answers.environment;
  config.set(`defaults.environment`, environment);
  config.set(`${environment}.defaults.account`, argv.account || answers.account);
  config.set(`${environment}.defaults.useClientCredentials`, (argv.clientId !== undefined && argv.clientSecret !== undefined) || answers.useClientCredentials || false);
  if (argv.clientId !== undefined || answers.clientId) {
    config.set(`${environment}.defaults.clientId`, argv.clientId || answers.clientId);
  }
  if (argv.clientSecret || answers.clientSecret) {
    // Provide a little obfuscation for the client secret
    config.set(`${environment}.defaults.clientSecret`, Buffer.from(argv.clientSecret || answers.clientSecret).toString('base64'));
  }

  config.set(`${environment}.defaults.useAuthClient`, argv.authClientId !== undefined || answers.useAuthClient || false);
  if (argv.authClientId !== undefined || answers.authClientId) {
    config.set(`${environment}.defaults.authClientId`, argv.authClientId || answers.authClientId);
  }
  if (argv.authClientSecret !== undefined || answers.authClientSecret) {
    // Provide a little obfuscation for the client secret
    config.set(`${environment}.defaults.authClientSecret`, Buffer.from(argv.authClientSecret || answers.authClientSecret).toString('base64'));
  }

  config.set(`${environment}.defaults.useApiKey`, argv.apiKey !== undefined || answers.useApiKey || false);
  if (argv.apiKey !== undefined || answers.apiKey) {
    config.set(`${environment}.defaults.apiKey`, argv.apiKey || answers.apiKey);
  } else {
    config.delete(`${environment}.defaults.apiKey`);
  }

  console.log(chalk.green(`Default settings have been saved.`));
};
