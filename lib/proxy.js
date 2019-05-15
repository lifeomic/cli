'use strict';

const config = require('./config');

function configureProxy () {
  const environment = config.getEnvironment();
  if (!config.get(`${environment}.defaults.useHttpProxy`)) {
    return false;
  }
  const pHost = config.get(`${environment}.defaults.httpProxyHost`);
  const pPort = config.get(`${environment}.defaults.httpProxyPort`);
  const httpsProxy = config.get(`${environment}.defaults.httpProxyHttps`);
  return {
    host: pHost,
    port: pPort,
    isHttps: httpsProxy
  };
}

module.exports = { configureProxy: configureProxy };
