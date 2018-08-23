'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const mocks = {
  '../../api': {
    get: getStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const list = proxyquire('../../../lib/cmds/accounts_cmds/list', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "accounts list" command should list accounts for a user', t => {
  const res = { data: { accounts: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/accounts');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { accounts: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list');
});
