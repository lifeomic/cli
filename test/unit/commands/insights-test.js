'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const postStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const program = proxyquire('../../../lib/commands/insights', {
  '../api': {
    post: postStub
  },
  '../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

test.afterEach.always(t => {
  postStub.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "insights-run-query" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };
  program.parse(['node', 'lo', 'insights-run-query', '1', '--query', `${__dirname}/insights-data/query.json`]);
});

test.serial.cb('The "insights-run-query" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };
  program.parse(['node', 'lo', 'insights-run-query', '1', '--string-query', 'SELECT filter FROM gene']);
});
