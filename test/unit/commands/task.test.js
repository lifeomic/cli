'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const yargs = require('yargs');
const getStub = sinon.stub();
const postStub = sinon.stub();
const printSpy = sinon.spy();
const readStub = sinon.stub();
let callback;

const mocks = {
  '../../api': {
    get: getStub,
    post: postStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
};

const get = proxyquire('../../../lib/cmds/tasks_cmds/get', mocks);
const cancel = proxyquire('../../../lib/cmds/tasks_cmds/cancel', mocks);
const list = proxyquire('../../../lib/cmds/tasks_cmds/list', mocks);
const create = proxyquire('../../../lib/cmds/tasks_cmds/create', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "tasks" command should list tasks for an account', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/tasks?pageSize=25&nextPageToken=&datasetId=1');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list 1');
});

test.serial.cb('The "tasks-get" command should fetch a task', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/tasks/taskid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get taskid');
});

test.serial.cb('The "tasks-create" command should create a task', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = { name: 'my task' };
  readStub.onFirstCall().returns(data);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(create)
    .parse('create');
});

test.serial.cb('The "tasks-cancel" command should cancel a task', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks/taskId:cancel');
    t.end();
  };

  yargs.command(cancel)
    .parse('cancel taskId');
});
