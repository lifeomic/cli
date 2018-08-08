'use strict';

const test = require('ava');
const fhir = require('../../lib/fhir');

test('fhir requests should prefer strict handling', async t => {
  const request = fhir.request({});
  t.is(request.defaults.headers['Prefer'], 'handling=strict');
});
