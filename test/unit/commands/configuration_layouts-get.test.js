'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');
const yargs = require('yargs');
const getStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const mocks = {
  '../../apps': {
    get: getStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const get = proxyquire('../../../lib/cmds/configuration_layouts_cmds/get', mocks);

test.cb('The "Configuration_layouts" command should list layouts in a project\'s patient layouts.', t => {
  const res = { data: { items: [] } };

  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/configuration/layouts?project=111112222&type=patient&format=json');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get 111112222 patient');
});
