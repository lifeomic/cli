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

const create = proxyquire('../../../../lib/cmds/workflows_cmds/create', mocks);
const del = proxyquire('../../../../lib/cmds/workflows_cmds/delete', mocks);
const get = proxyquire('../../../../lib/cmds/workflows_cmds/get', mocks);
const list = proxyquire('../../../../lib/cmds/workflows_cmds/list', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  callback = null;
});

test.serial.cb('The "create" command should create a workflow when using input file ids', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = {
    datasetId: 'dataset',
    name: 'template_name',
    workflowSourceFileId: 'workflow-id',
    workflowInputsFileId: 'inputs-file-id',
    workflowDependenciesFileIds: ['dependency-file-1', 'dependency-file-2'],
    outputProjectFolder: 'my/cool/path'
  };

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/workflows/ga4gh/wes/runs');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(create)
    .parse('create dataset -n template_name -p my/cool/path -w workflow-id -f inputs-file-id -d dependency-file-1,dependency-file-2');
});

test.serial.cb('The "delete" should delete a workflow', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/workflows/ga4gh/wes/runs/workflowId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(del)
    .parse('delete workflowId');
});

test.serial.cb('The "get" should get a workflow', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/workflows/ga4gh/wes/runs/workflowId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get workflowId');
});

test.serial.cb('The "list" command should list workflows for an account', t => {
  const res = { data: { items: [] } };
  listStub.onFirstCall().returns(res);
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/workflows/ga4gh/wes/runs?datasetId=dataset');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res);
    t.end();
  };

  yargs.command(list)
    .parse('list dataset');
});
