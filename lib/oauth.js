'use strict';

const axios = require('axios');
const chalk = require('chalk');
const crypto = require('crypto');
const debug = require('debug')('lo:oauth');
const http = require('http');
const open = require('open');
const querystring = require('querystring');
const url = require('url');
const config = require('./config');
const stoppable = require('stoppable');
const configureProxy = require('./proxy');

const PORT = 8787;
const REDIRECT_URL = `http://localhost:${PORT}`;

function base64URLEncode (str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256 (buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

module.exports.tokenPost = function (environment, secret, formdata) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  if (secret) {
    headers.Authorization = `Basic ${secret}`;
  }

  const proxy = configureProxy();

  try {
    return axios.post(`/v1/oauth/token`, querystring.stringify(formdata), {
      baseURL: config.get(`${environment}.apiUrl`),
      proxy: proxy,
      headers: headers
    });
  } catch (err) {
    if (err.response &&
      err.response.data &&
      err.response.data.error === 'invalid_grant') {
      throw new Error(`Credentials have expired.  Use 'lo auth' to obtain new credentials`);
    }
    throw err;
  }
};

function showLogin (environment, state, verifier) {
  return () => {
    debug(`http server listening on ${PORT}`);
    const challenge = base64URLEncode(sha256(verifier));
    const defaults = config.get(`${environment}.defaults`);

    const opts = {
      response_type: 'code',
      client_id: defaults.useAuthClient ? defaults.authClientId : config.get(environment).clientId,
      redirect_uri: REDIRECT_URL,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      state: state
    };

    const appName = process.platform === 'darwin' || process.platform === 'win32' ? null : 'xdg-open';

    open(`${config.get(`${environment}.apiUrl`)}/v1/oauth/authorize?${querystring.stringify(opts)}`, appName, (e) => {
      if (e) {
        console.log(chalk.red('Failed to open browser.', e));
        process.exit(1);
      } else {
        console.log(chalk.green('Opened browser for auth...'));
      }
    });
  };
}

function requestHandler (environment, server, state, verifier) {
  return async (req, res) => {
    debug(req.url);
    const parsed = url.parse(req.url);
    const params = querystring.parse(parsed.query);

    if (!params.code) {
      res.writeHead(404, {});
      res.end();
      return;
    }

    debug(`Showing success web page`);
    await new Promise(resolve => {
      res.end(`
      <html>
        <script>
          setTimeout(function () {
            window.open('','_self','').close();
          }, 5000);
        </script>
        <h3 style="text-align: center;">
        Authentication is successful.  This browser tab should automatically close after after a few seconds.  If it does not, it can be closed manually.
        </h3>
        <button onclick="javascript:window.open('','_self','').close();">Close (TAB, Enter)</button>
      </html>
      `, 'utf8', resolve);
    });

    debug(`stopping http server...`);
    await new Promise(resolve => server.stop(resolve));
    debug(`stopped http server listening on ${PORT}`);

    if (params.state !== state) {
      throw new Error('An error occurred during authentication');
    }

    const defaults = config.get(`${environment}.defaults`);
    let secret = null;
    if (defaults.useAuthClient && defaults.authClientSecret) {
      const clientSecret = Buffer.from(defaults.authClientSecret, 'base64').toString('utf8');
      secret = Buffer.from(`${defaults.authClientId}:${clientSecret}`).toString('base64');
    }

    const response = await module.exports.tokenPost(environment, secret, {
      grant_type: 'authorization_code',
      client_id: defaults.useAuthClient ? defaults.authClientId : config.get(environment).clientId,
      code: params.code,
      code_verifier: verifier,
      redirect_uri: REDIRECT_URL
    });
    config.set(`${environment}.tokens.accessToken`, response.data.access_token);
    config.set(`${environment}.tokens.refreshToken`, response.data.refresh_token);
    console.log(chalk.green('Authentication successful'));
  };
}

/**
 * Executes Oauth code grant flow using PKCE (https://tools.ietf.org/html/rfc7636)
 */
module.exports.login = () => {
  const state = base64URLEncode(crypto.randomBytes(32));
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const environment = config.getEnvironment();

  // Use stoppable here with a shutdown time of 1ms
  // so that the server dies right away inside
  // requestHandler():
  const server = stoppable(http.createServer(), 1);

  server
    .on('listening', showLogin(environment, state, verifier))
    .on('error', err => { throw err; })
    .on('request', requestHandler(environment, server, state, verifier))
    .listen(PORT);
};
