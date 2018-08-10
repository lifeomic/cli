'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const promptStub = sinon.stub();
const setStub = sinon.stub();

const program = proxyquire('../../../lib/cmds/auth', {
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

  yargs.command(program)
    .parse('auth --set');

  t.true(setStub.calledWith('env.tokens.accessToken', 'token'));
});
