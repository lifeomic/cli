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

const create = proxyquire('../../../../lib/cmds/workflows_cmds/create-template', mocks);
const del = proxyquire('../../../../lib/cmds/workflows_cmds/delete-template', mocks);
const get = proxyquire('../../../../lib/cmds/workflows_cmds/get-template', mocks);
const list = proxyquire('../../../../lib/cmds/workflows_cmds/list-templates', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  callback = null;
});

test.serial.cb('The "create-template" command should create a template', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = { name: 'my template' };
  readStub.onFirstCall().returns(data);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/workflows/templates');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(create)
    .parse('create-template');
});

test.serial.cb('The "delete-template" should delete a template', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/workflows/templates/templateId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(del)
    .parse('delete-template templateId');
});

test.serial.cb('The "get-template" should get a template', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/workflows/templates/templateId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get-template templateId');
});

test.serial.cb('The "list-template" command should list templates for an account', t => {
  const res = { data: { items: [] } };
  listStub.onFirstCall().returns(res);
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/workflows/templates?datasetId=dataset');
    t.is(printSpy.callCount, 1);
    console.log(printSpy.getCall(0).args[0]);
    t.is(printSpy.getCall(0).args[0], res);
    t.end();
  };

  yargs.command(list)
    .parse('list-templates dataset');
});
