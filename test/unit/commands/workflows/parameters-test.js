'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const readStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
const listStub = sinon.stub();
let callback;

const mocks = {
  '../../workflow': {
    get: getStub,
    post: postStub,
    del: delStub,
    list: listStub,
    read: readStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
};

const create = proxyquire('../../../../lib/cmds/workflows_cmds/create-parameters', mocks);
const del = proxyquire('../../../../lib/cmds/workflows_cmds/delete-parameters', mocks);
const get = proxyquire('../../../../lib/cmds/workflows_cmds/get-parameters', mocks);
const list = proxyquire('../../../../lib/cmds/workflows_cmds/list-parameters', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  callback = null;
});

test.serial.cb('The "create-parameters" command should create a parameters set', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = { name: 'my parameters' };
  readStub.onFirstCall().returns(data);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/workflows/parameters');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(create)
    .parse('create-parameters');
});

test.serial.cb('The "delete-parameters" should delete a parameters set', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/workflows/parameters/parametersId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(del)
    .parse('delete-parameters parametersId');
});

test.serial.cb('The "get-parameters" should get a parameters set', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/workflows/parameters/parametersId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get-parameters parametersId');
});

test.serial.cb('The "list-parameters" command should list parameters sets for an account', t => {
  const res = { data: { items: [] } };
  listStub.onFirstCall().returns(res);
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/workflows/parameters?datasetId=dataset');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res);
    t.end();
  };

  yargs.command(list)
    .parse('list-parameters dataset');
});
