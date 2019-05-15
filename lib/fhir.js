'use strict';

const axios = require('axios');
const axiosRetry = require('axios-retry');
const config = require('./config');
const { name, version } = require('../package.json');
const configureProxy = require('./proxy');
const tokenProvider = require('./interceptor/tokenProvider');

// These retry settings will retry more times (5 vs 3),
// with an exponential backoff (rather than no delay)
// and will retry POST (normally POST requests are not
// retried since they are not idempotent, but in FHIR
// we use POST for searches and ingest, both of which are
// idempotent (assuming ingest uses client supplied ids
// which it usually does.), and will retry timeouts.
// This all makes ingest in particular much more reliable,
// which is important when ingesting large datasets.
const shouldRetry = error => {
  return axiosRetry.isNetworkError(error) ||
    axiosRetry.isRetryableError(error) ||
    error.code === 'ECONNABORTED' ||
    (error.response && error.response.status === 429);
};
const retryConfig = {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: shouldRetry,
  shouldResetTimeout: true
};
axios.defaults.timeout = 16000; // 16 seconds

axios.defaults.headers.common['User-Agent'] = `${name}/${version}`;

function request (options) {
  const environment = config.getEnvironment();

  const account = options.account || config.get(`${environment}.defaults.account`);
  if (!account) {
    throw new Error(`Account needs to be set with 'lo defaults' or specified with the -a option.`);
  }

  const proxy = configureProxy.configureProxy();

  const client = axios.create({
    baseURL: `${config.get(`${environment}.fhirUrl`)}`,
    proxy: proxy,
    headers: {
      'Prefer': 'handling=strict'
    }
  });
  client.interceptors.request.use(tokenProvider);
  axiosRetry(client, retryConfig);
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

module.exports.getAccount = (options) => {
  const environment = config.getEnvironment();
  return options.account || config.get(`${environment}.defaults.account`);
};
