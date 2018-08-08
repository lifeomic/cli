'use strict';

const axios = require('axios');
const axiosRetry = require('axios-retry');
const config = require('./config');
const { name, version } = require('../package.json');
const tokenProvider = require('./interceptor/tokenProvider');

axiosRetry(axios, { retries: 3 });
axios.defaults.headers.common['User-Agent'] = `${name}/${version}`;

function request (options) {
  const environment = config.getEnvironment();

  const account = options.account || config.get(`${environment}.defaults.account`);
  if (!account) {
    throw new Error(`Account needs to be set with 'lo defaults' or specified with the -a option.`);
  }

  const client = axios.create({
    baseURL: `${config.get(`${environment}.fhirUrl`)}`,
    headers: {
      'Prefer': 'handling=strict'
    }
  });
  client.interceptors.request.use(tokenProvider);
  axiosRetry(client, { retries: 3 });
  return client;
}

module.exports.request = request;

module.exports.get = function (options, path, config) {
  return request(options).get(path, config);
};

module.exports.put = function (options, path, body, config) {
  return request(options).put(path, body, config);
};

module.exports.post = function (options, path, body, config) {
  return request(options).post(path, body, config);
};

module.exports.del = function (options, path, body, config) {
  return request(options).delete(path, body, config);
};
