'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');
const jwt = require('jsonwebtoken');

const postStub = sinon.stub();
const getStub = sinon.stub();
const setSpy = sinon.spy();

const tokenProvider = proxyquire('../../../lib/interceptor/tokenProvider', {
  '../oauth': {
    tokenPost: postStub
  },
  'axios-retry': sinon.spy(),
  '../config': {
    getEnvironment: () => 'dev',
    get: getStub,
    set: setSpy
  }
});

test.beforeEach((t) => {
  t.clock = sinon.useFakeTimers();
  t.clock.now = 500000;
});

test.afterEach.always(t => {
  postStub.resetHistory();
  getStub.resetHistory();
  setSpy.resetHistory();
});

test.serial(`tokenProvider should set the request Authorization header with a token from config`, async t => {
  const token = jwt.sign({
    sub: '1234',
    iss: 'cognito',
    token_use: 'access',
    exp: 2000
  }, 'secret');
  getStub.withArgs('dev.tokens.accessToken').returns(token);
  getStub.withArgs('dev.defaults').returns({});

  const config = { headers: {} };
  await tokenProvider(config);
  t.is(config.headers.Authorization, `Bearer ${token}`);
  t.false(postStub.called);
  t.false(setSpy.called);
});

test.serial(`tokenProvider should set the request Authorization header with a token from config`, async t => {
  const token = jwt.sign({
    sub: '1234',
    iss: 'cognito',
    token_use: 'access',
    exp: 2000
  }, 'secret');
  getStub.withArgs('dev.tokens.accessToken').returns(token);
  getStub.withArgs('dev.defaults').returns({});

  const config = { headers: {} };
  await tokenProvider(config);
  t.is(config.headers.Authorization, `Bearer ${token}`);
  t.false(postStub.called);
  t.false(setSpy.called);
});

test.serial(`tokenProvider should try to refresh an expired token only if a refresh token is present`, async t => {
  const token = jwt.sign({
    sub: '1234',
    iss: 'cognito',
    token_use: 'access',
    exp: 1000 // expiration time is 1100
  }, 'secret');
  getStub.withArgs('dev.tokens.accessToken').returns(token);
  getStub.withArgs('dev.tokens.refreshToken').returns(null);
  getStub.withArgs('dev.defaults').returns({});

  const config = { headers: {} };
  await tokenProvider(config);
  t.is(config.headers.Authorization, `Bearer ${token}`);
  t.false(postStub.called);
  t.false(setSpy.called);
});

test.serial(`tokenProvider should try to refresh an expired token only if a refresh token is present`, async t => {
  const token = jwt.sign({
    sub: '1234',
    iss: 'cognito',
    token_use: 'access',
    exp: 1000 // expiration time is 1100
  }, 'secret');
  getStub.withArgs('dev.tokens.accessToken').returns(token);
  getStub.withArgs('dev.tokens.refreshToken').returns('refreshToken');
  getStub.withArgs('dev.apiUrl').returns('https://api.com');
  getStub.withArgs('dev.defaults').returns({});
  getStub.withArgs('dev').returns({
    clientId: 'clientId'
  });
  postStub.returns({ data: {
    access_token: 'newToken'
  }});

  const config = { headers: {} };
  await tokenProvider(config);
  t.is(config.headers.Authorization, `Bearer newToken`);
  t.true(postStub.calledWith(`dev`,
    null,
    {
      grant_type: 'refresh_token',
      client_id: 'clientId',
      refresh_token: 'refreshToken'
    }));
  t.true(setSpy.calledWith(`dev.tokens.accessToken`, 'newToken'));
});

test.serial(`tokenProvider should get an access token with client credentials when present`, async t => {
  getStub.withArgs('dev.tokens.accessToken').returns(null);
  getStub.withArgs('dev.apiUrl').returns('https://api.com');
  getStub.withArgs('dev.defaults').returns({
    useClientCredentials: true,
    clientId: 'clientId',
    clientSecret: Buffer.from('clientSecret').toString('base64')
  });
  postStub.returns({ data: {
    access_token: 'newToken'
  }});

  const config = { headers: {} };
  await tokenProvider(config);
  t.is(config.headers.Authorization, `Bearer newToken`);
  t.true(postStub.calledWith('dev',
    Buffer.from(`clientId:clientSecret`).toString('base64'),
    {
      grant_type: 'client_credentials'
    }));
  t.true(setSpy.calledWith(`dev.tokens.accessToken`, 'newToken'));
});

test.serial(`tokenProvider should throw if oauth token request fails`, async t => {
  getStub.withArgs('dev.tokens.accessToken').returns(null);
  getStub.withArgs('dev.apiUrl').returns('https://api.com');
  getStub.withArgs('dev.defaults').returns({
    useClientCredentials: true,
    clientId: 'clientId',
    clientSecret: Buffer.from('clientSecret').toString('base64')
  });
  postStub.throws();

  const config = { headers: {} };
  await t.throws(tokenProvider(config));
});

test.serial(`tokenProvider should throw if custom client settings are missing`, async t => {
  getStub.withArgs('dev.tokens.accessToken').returns(null);
  getStub.withArgs('dev.apiUrl').returns('https://api.com');
  getStub.withArgs('dev.defaults').returns({
    useClientCredentials: true
  });

  const config = { headers: {} };
  await t.throws(tokenProvider(config));
});

test.serial(`tokenProvider should throw if access token is missing`, async t => {
  getStub.withArgs('dev.tokens.accessToken').returns(null);
  getStub.withArgs('dev.apiUrl').returns('https://api.com');
  getStub.withArgs('dev.defaults').returns({
    useClientCredentials: false
  });

  const config = { headers: {} };
  await t.throws(tokenProvider(config));
});
