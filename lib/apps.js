'use strict';

const axios = require('axios');
const axiosRetry = require('axios-retry');
// const tunnel = require('tunnel');
const chalk = require('chalk');
const { Bar } = require('cli-progress');
const fs = require('fs');
const config = require('./config');
const mkdirp = require('mkdirp');
const { name, version } = require('../package.json');
const queue = require('queue');
const { dirname } = require('path');
const tokenProvider = require('./interceptor/tokenProvider');
const debug = require('debug')('lo:api');
const FileVerificationStream = require('./FileVerificationStream');
const configureProxy = require('./proxy');

axiosRetry(axios, {
  retries: 3
});
axios.defaults.headers.common['User-Agent'] = `${name}/${version}`;

const PART_BYTES_SIZE = process.env.PART_BYTES_SIZE || 5 * 1024 * 1024;
const MAX_PARTS = 10000;

function request (options) {
  const environment = config.getEnvironment();

  const account = options.account || config.get(`${environment}.defaults.account`);
  if (!account) {
    throw new Error(`Account needs to be set with 'lo defaults' or specified with the -a option.`);
  }

  const proxy = configureProxy();
  const baseURL = config.get(`${environment}.appsUrl`);

  const client = axios.create({
    baseURL: baseURL,
    proxy: proxy,
    headers: {
      'LifeOmic-Account': account
    }
  });
  client.interceptors.request.use(tokenProvider);
  axiosRetry(client, { retries: 3 });
  return client;
}

function progress (name) {
  return new Bar({
    format: `${name} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes`,
    hideCursor: true,
    clearOnComplete: true,
    barsize: 30
  });
}

module.exports.MULTIPART_MIN_SIZE = PART_BYTES_SIZE;

module.exports.get = function (options, path) {
  return request(options).get(path);
};

module.exports.del = function (options, path) {
  return request(options).delete(path);
};

module.exports.post = function (options, path, body) {
  return request(options).post(path, body);
};

module.exports.put = function (options, path, body) {
  return request(options).put(path, body);
};

