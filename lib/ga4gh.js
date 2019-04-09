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
    baseURL: `${config.get(`${environment}.ga4ghUrl`)}/${account}/v1`,
    headers: {
      'LifeOmic-Account': account
    }
  });
  client.interceptors.request.use(tokenProvider);
  axiosRetry(client, { retries: 3 });
  return client;
}

module.exports.get = function (options, path) {
  return request(options).get(path);
};

module.exports.del = function (options, path) {
  return request(options).delete(path);
};

module.exports.post = function (options, path, body) {
  return request(options).post(path, body);
};

module.exports.list = async function (options, path, body, itemProp) {
  const items = {};
  // eslint-disable-next-line security/detect-object-injection
  items[itemProp] = [];

  do {
    body.pageSize = 1000;
    const result = await module.exports.post(options, path, body);
    // eslint-disable-next-line security/detect-object-injection
    for (const item of result.data[itemProp]) {
      // eslint-disable-next-line security/detect-object-injection
      items[itemProp].push(item);
    }
    body.pageToken = result.data.nextPageToken;
  // eslint-disable-next-line security/detect-object-injection
  } while (body.pageToken && items[itemProp].length < options.limit);

  return items;
};
