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

const build = proxyquire('../../../../lib/cmds/workflows_cmds/build-workflow', mocks);
const create = proxyquire('../../../../lib/cmds/workflows_cmds/create-workflow', mocks);
const del = proxyquire('../../../../lib/cmds/workflows_cmds/delete-workflow', mocks);
const get = proxyquire('../../../../lib/cmds/workflows_cmds/get-workflow', mocks);
const list = proxyquire('../../../../lib/cmds/workflows_cmds/list-workflows', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  callback = null;
});

test.serial.cb('The "build-workflow" command should create a workflow', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = {
    datasetId: 'dataset',
    name: 'template_name',
    template: {
      id: 'templateId',
      type: 'RESOURCE'
    },
    parameter: {
      id: 'paramterId',
      type: 'RESOURCE'
    }
  };

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/workflows');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(build)
    .parse('build-workflow dataset -n template_name -t templateId -p paramterId');
});

test.serial.cb('The "create-workflow" command should create a workflow', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = { name: 'my workflow' };
  readStub.onFirstCall().returns(data);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/workflows');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(create)
    .parse('create-workflow');
});

test.serial.cb('The "delete-workflow" should delete a workflow', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/workflows/workflowId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(del)
    .parse('delete-workflow workflowId');
});

test.serial.cb('The "get-workflow" should get a workflow', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/workflows/workflowId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get-workflow workflowId');
});

test.serial.cb('The "list-workflow" command should list workflows for an account', t => {
  const res = { data: { items: [] } };
  listStub.onFirstCall().returns(res);
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/workflows?datasetId=dataset');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res);
    t.end();
  };

  yargs.command(list)
    .parse('list-workflows dataset');
});
