'use strict';

const test = require('ava');

const proxyquire = require('proxyquire');

const fhir = proxyquire('../../lib/fhir', {
  './config': {
    getEnvironment () { return 'test'; },
    get () { return 'dummy'; }
  }
});

test('fhir requests should prefer strict handling', async t => {
  const request = fhir.request({});
  t.is(request.defaults.headers['Prefer'], 'handling=strict');
});
