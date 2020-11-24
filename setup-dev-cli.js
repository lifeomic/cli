/* eslint-disable no-unused-vars */

'use-strict';

const Configstore = require('configstore');

const config = new Configstore('lifeomic-cli', {
  dev: {
    userPooldId: 'us-east-1_SBtGmcJ7T',
    clientId: '2qt93qphnctjbs9ftdpjhvgkl1',
    apiUrl: 'https://api.dev.lifeomic.com',
    appsUrl: 'https://apps.dev.lifeomic.com/phc/api',
    fhirUrl: 'https://fhir.dev.lifeomic.com',
    ga4ghUrl: 'https://ga4gh.dev.lifeomic.com'
  },
  'prod-us': {
    userPooldId: 'us-east-2_ojOIXR4W7',
    clientId: '2qt93qphnctjbs9ftdpjhvgkl1',
    apiUrl: 'https://api.us.lifeomic.com',
    appsUrl: 'https://apps.us.lifeomic.com/phc/api',
    fhirUrl: 'https://fhir.us.lifeomic.com',
    ga4ghUrl: 'https://ga4gh.us.lifeomic.com'
  }
});

console.log(`Config has been saved`);
