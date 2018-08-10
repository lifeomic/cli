'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const postStub = sinon.stub();
const printSpy = sinon.spy();
const readStub = sinon.stub();
let callback;

const program = proxyquire('../../../lib/cmds/insights_cmds/query', {
  '../../api': {
    post: postStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
});

test.afterEach.always(t => {
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "insights-run-query" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  readStub.onFirstCall().returns('{}');

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(program)
    .parse('query 1');
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

  yargs.command(program)
    .parse('query 1 --sql "SELECT filter FROM gene"');
});
