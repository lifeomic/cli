'use strict';

const Configstore = require('configstore');

const conf = new Configstore('lifeomic-cli', {
  'prod-us': {
    userPooldId: 'us-east-2_ojOIXR4W7',
    clientId: '2qt93qphnctjbs9ftdpjhvgkl1',
    apiUrl: 'https://api.us.lifeomic.com',
    appsUrl: 'https://apps.us.lifeomic.com/phc/api',
    fhirUrl: 'https://fhir.us.lifeomic.com',
    ga4ghUrl: 'https://ga4gh.us.lifeomic.com',
    defaults: {
      useHttpProxy: false,
      httpProxyHost: '',
      httpProxyPort: '',
      httpProxyHttps: false
    }
  }
});

conf.getEnvironment = () => {
  const environment = process.env.LIFEOMIC_ENVIRONMENT || conf.get(`defaults.environment`);
  if (!environment || !conf.get(environment)) {
    throw new Error(`Default LifeOmic environment has not been specified.  Run 'lo setup'.`);
  }
  return environment;
};

module.exports = conf;
