'use strict';

const test = require('ava');
const config = require('../../lib/config');

const CONFIG_FIXTURE = {
  dev: {
    userPooldId: 'dev-userPoolId',
    clientId: 'dev-clientId',
    apiUrl: 'dev-apiUrl',
    fhirUrl: 'dev-fhirUrl',
    ga4ghUrl: 'dev-ga4ghUrl'
  },
  'prod-us': {
    userPooldId: 'prod-us-userPoolId',
    clientId: 'prod-us-clientId',
    apiUrl: 'prod-us-apiUrl',
    fhirUrl: 'prod-us-fhirUrl',
    ga4ghUrl: 'prod-us-ga4ghUrl'
  }
};

const _ORIGINAL_LIFEOMIC_ENVIRONMENT = process.env.LIFEOMIC_ENVIRONMENT;
const originalConfig = config.all;
test.after(t => {
  process.env.LIFEOMIC_ENVIRONMENT = _ORIGINAL_LIFEOMIC_ENVIRONMENT;
  config.all = originalConfig;
});

test.beforeEach(t => {
  delete process.env.LIFEOMIC_ENVIRONMENT;
  config.all = CONFIG_FIXTURE;
});

test(`getEnvironment should first prefer process.env.LIFEOMIC_ENVIRONMENT, then configstore 'defaults.environment' second for the target environment`, t => {
  const DEV = 'dev';
  const PROD = 'prod-us';

  process.env.LIFEOMIC_ENVIRONMENT = DEV;
  config.set('defaults.environment', PROD);
  t.is(config.getEnvironment(), DEV);

  delete process.env.LIFEOMIC_ENVIRONMENT;
  t.is(config.getEnvironment(), PROD);
});

test(`getEnvironment should Error when the process.env.LIFEOMIC_ENVIRONMENT specifies an environment that is not found`, t => {
  process.env.LIFEOMIC_ENVIRONMENT = 'bobsburgers-us';
  const error = t.throws(() => {
    config.getEnvironment();
  }, Error);

  t.is(error.message, `Default LifeOmic environment has not been specified.  Run 'lo setup'.`);
});

test(`getEnvironment should Error when 'lo setup' has not been run; Implying process.env.LIFEOMIC_ENVIRONMENT and configstore file (and the value 'defaults.enviornment') are undefined`, t => {
  // Configstore's behavior during config.get(environment) when environment is undefined, is to return the whole hash/object.
  delete process.env.LIFEOMIC_ENVIRONMENT;
  config.all = undefined;
  const error = t.throws(() => {
    config.getEnvironment();
  }, Error);

  t.is(error.message, `Default LifeOmic environment has not been specified.  Run 'lo setup'.`);
});
