'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const promptStub = sinon.stub();
const setStub = sinon.stub();

const program = proxyquire('../../../lib/commands/auth', {
  'inquirer': {
    prompt: promptStub
  },
  '../config': {
    set: setStub,
    getEnvironment: () => 'env'
  }
});

test.afterEach(t => {
  promptStub.resetHistory();
  setStub.resetHistory();
});

test.serial('The "auth --set" command should update the current access token', async t => {
  promptStub.returns({
    token: 'token'
  });

  await program.parse(['node', 'lo', 'auth', '--set']);

  t.true(setStub.calledWith('env.tokens.accessToken', 'token'));
});
