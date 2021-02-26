'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
const readStub = sinon.stub();
let callback;

const mocks = {
  '../../api': {
    get: getStub,
    post: postStub,
    del: delStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
};

const get = proxyquire('../../../lib/cmds/cohorts_cmds/get', mocks);
const del = proxyquire('../../../lib/cmds/cohorts_cmds/del', mocks);
const list = proxyquire('../../../lib/cmds/cohorts_cmds/list', mocks);
const create = proxyquire('../../../lib/cmds/cohorts_cmds/create', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  delStub.resetHistory();
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "cohorts" command should list cohorts for a project', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/cohorts?projectId=1&pageSize=25&nextPageToken=');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list 1');
});

test.serial.cb('The "cohorts" command should list cohorts for a project with optional args', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/cohorts?projectId=1&pageSize=30&nextPageToken=token');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list 1 --page-size 30 --next-page-token token');
});

test.serial.cb('The "cohorts-get" command should get a cohort', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/cohorts/1');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get 1');
});

test.serial.cb('The "cohorts-create" command should create a cohort', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = ['06145c42-0625-4dc4-92c7-dbf600e7866a'];
  readStub.onFirstCall().returns(data);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/cohorts');
    t.deepEqual(postStub.getCall(0).args[2], {
      name: 'Cohort Name',
      description: 'Cohort Description',
      ownerProject: '1',
      subjectIds: data
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(create)
    .parse('create "Cohort Name" --projectId 1 --description "Cohort Description"');
});

test.serial.cb('The "cohorts-delete" command should remove a cohort', t => {
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/v1/cohorts/1');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], 'Deleted cohort: 1');
    t.end();
  };

  yargs.command(del)
    .parse('delete 1');
});
