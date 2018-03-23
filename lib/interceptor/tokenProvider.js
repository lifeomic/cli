'use strict';

const debug = require('debug')('lo:tokenProvider');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { tokenPost } = require('../oauth');

async function getToken () {
  const environment = config.getEnvironment();
  let accessToken = config.get(`${environment}.tokens.accessToken`);
  const defaults = config.get(`${environment}.defaults`);

  if (!accessToken && !defaults.useClientCredentials) {
    throw new Error(`Need to run 'lo auth' to get an access token for this command`);
  }

  let expired = false;

  if (accessToken) {
    const decoded = jwt.decode(accessToken);
    expired = decoded.exp < ((Date.now() / 1000) + (10 * 60));
  }

  if (expired || !accessToken) {
    debug('Token is about to expire. Refreshing...');
    const refreshToken = config.get(`${environment}.tokens.refreshToken`);

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
  return accessToken;
}

module.exports = async config => {
  const token = await getToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
};
