'use strict';

const Configstore = require('configstore');

const conf = new Configstore('lifeomic-cli', {
  'prod-us': {
    userPoolId: 'us-east-2_ojOIXR4W7',
    clientId: '2qt93qphnctjbs9ftdpjhvgkl1',
    apiUrl: 'https://api.us.lifeomic.com',
    appsUrl: 'https://apps.us.lifeomic.com/phc/api',
    fhirUrl: 'https://fhir.us.lifeomic.com',
    ga4ghUrl: 'https://ga4gh.us.lifeomic.com'
  },
  'prod-us-fed': {
    userPoolId: 'us-gov-west-1_F45nuW4M5',
    clientId: '1pjluh035vrh65s0o9phs1brdc',
    apiUrl: 'https://api.us.fed.lifeomic.com',
    appsUrl: 'https://apps.us.fed.lifeomic.com/phc/api',
    fhirUrl: 'https://fhir.us.fed.lifeomic.com',
    ga4ghUrl: 'https://ga4gh.us.fed.lifeomic.com'
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
