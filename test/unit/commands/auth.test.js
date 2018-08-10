'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const promptStub = sinon.stub();
const setStub = sinon.stub();
let callback;

const program = proxyquire('../../../lib/cmds/auth', {
  'inquirer': {
    prompt: promptStub
  },
  '../config': {
    set: (key, value) => {
      setStub(key, value);
      callback();
    },
    getEnvironment: () => 'env'
  }
});

test.afterEach(t => {
  promptStub.resetHistory();
  setStub.resetHistory();
});

test.serial.cb('The "auth --set" command should update the current access token', t => {
  promptStub.returns({
    token: 'token'
  });

  callback = () => {
    t.true(setStub.calledWith('env.tokens.accessToken', 'token'));
    t.end();
  };

  yargs.command(program)
    .parse('auth --set');
});
