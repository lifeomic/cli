'use strict';

const debug = require('debug')('lo:tokenProvider');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { tokenPost } = require('../oauth');

async function getToken () {
  const environment = config.getEnvironment();
  let accessToken = config.get(`${environment}.tokens.accessToken`) || process.env.PHC_ACCESS_TOKEN;
  const defaults = config.get(`${environment}.defaults`) || {};

  if (!accessToken && !defaults.useClientCredentials && !defaults.useApiKey) {
    throw new Error(`Need to run 'lo auth' to get an access token for this command, or 'lo setup' to set API key or client credentials`);
  }

  let expired = false;

  if (defaults.useApiKey && defaults.apiKey) {
    return `Bearer ${defaults.apiKey}`;
  }

  if (accessToken) {
    const decoded = jwt.decode(accessToken);
    expired = decoded.exp < ((Date.now() / 1000) + (10 * 60));
  }

  if (expired || !accessToken) {
    debug('Token is about to expire. Refreshing...');
    const refreshToken = config.get(`${environment}.tokens.refreshToken`) || process.env.PHC_REFRESH_TOKEN;

    if (defaults.useClientCredentials) {
      if (!defaults.clientId || !defaults.clientSecret) {
        throw new Error(`Missing client configuration.  Run 'lo setup'.`);
      }
      const clientSecret = Buffer.from(defaults.clientSecret, 'base64').toString('utf8');
      const secret = Buffer.from(`${defaults.clientId}:${clientSecret}`).toString('base64');
      const response = await tokenPost(environment, secret, {
        grant_type: 'client_credentials'
      });
      accessToken = response.data.access_token;
      config.set(`${environment}.tokens.accessToken`, accessToken);
      debug('Access token refreshed');
    } else if (refreshToken) {
      const response = await tokenPost(environment, null, {
        grant_type: 'refresh_token',
        client_id: config.get(`${environment}.defaults.useAuthClient`) ? config.get(`${environment}.defaults.authClientId`) : config.get(environment).clientId,
        refresh_token: refreshToken
      });
      accessToken = response.data.access_token;
      config.set(`${environment}.tokens.accessToken`, accessToken);
      debug('Access token refreshed');
    }
  }
  return `Bearer ${accessToken}`;
}

module.exports = async requestConfig => {
  const token = await getToken();
  requestConfig.headers['Authorization'] = token;
  return requestConfig;
};
