'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const delStub = sinon.stub();
const getStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const mocks = {
  '../../api': {
    get: getStub,
    del: delStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const list = proxyquire('../../../lib/cmds/genomics_cmds/list-tests', mocks);
const deleteTest = proxyquire('../../../lib/cmds/genomics_cmds/delete-test', mocks);

test.afterEach.always(t => {
  delStub.resetHistory();
  getStub.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "list-tests" command should list tests for a subject', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/genomics/projects/project1/subjects/subject1/tests');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list-tests project1 subject1');
});

test.serial.cb('The "list-tests" command should list tests for a project', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/genomics/projects/project1/tests?pageSize=25&nextPageToken=');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list-tests project1');
});

test.serial.cb('The "delete-test" command should delete a test for a subject', t => {
  delStub.onFirstCall().returns({});
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/v1/genomics/projects/project1/tests/test1');
    t.end();
  };

  yargs.command(deleteTest)
    .parse('delete-test project1 test1');
});
