'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const getStub = sinon.stub();
const getApiStub = sinon.stub();
const readStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
const listStub = sinon.stub();
const downloadStub = sinon.stub();
const axiosMock = new MockAdapter(axios);
let callback;

const mocks = {
  '../../tool': {
    get: getStub,
    post: postStub,
    del: delStub,
    list: listStub,
    read: readStub,
    axios: axiosMock
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub(),
  '../../api': {
    download: downloadStub,
    get: getApiStub
  }
};

const create = proxyquire('../../../../lib/cmds/tools_cmds/create', mocks);
const del = proxyquire('../../../../lib/cmds/tools_cmds/delete', mocks);
const get = proxyquire('../../../../lib/cmds/tools_cmds/get', mocks);
const list = proxyquire('../../../../lib/cmds/tools_cmds/list', mocks);
const download = proxyquire('../../../../lib/cmds/tools_cmds/download', mocks);
const addVersion = proxyquire('../../../../lib/cmds/tools_cmds/add-version', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  downloadStub.resetHistory();
  getApiStub.resetHistory();
  callback = null;
});

test.serial.cb('The "create" command should create a tool', t => {
  const res = { data: {} };
  postStub.onCall(0).returns(res);

  const resUpload = { data: { uploadUrl: '/a/test/link' } };
  postStub.onCall(1).returns(resUpload);

  axiosMock.onPut('/a/test/link').reply(200);

  const data = {
    name: 'tool_name',
    description: 'my cli tool',
    access: 'ACCOUNT',
    version: '1.5.9',
    toolClassId: '1',
    descriptorType: 'CWL',
    labels: ['bam', 'samtools']
  };

  callback = () => {
    t.is(postStub.callCount, 2);
    t.is(postStub.getCall(0).args[1], '/trs/v2/tools');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(create)
    .parse('create -n tool_name  -d "my cli tool" -a ACCOUNT -t Workflow -s 1.5.9 -l "bam,samtools" -f "./test/unit/commands/tools/tool-test.js"');
});

test.serial.cb('The "get" should get a tool', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/trs/v2/tools/toolId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get toolId');
});

test.serial.cb('The "list" command should list tools', t => {
  const res = { data: { items: [] } };
  listStub.onFirstCall().returns(res);

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/trs/v2/tools?toolClass=Workflow&organization=lifeomictest&toolname=tool_name&author=me%40me.me&label=bam%2Crna');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res);
    t.end();
  };

  yargs.command(list)
    .parse('list -c Workflow -o lifeomictest -n tool_name -a me@me.me -l "bam,rna"');
});

test.serial.cb('The "delete" should delete a tool', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/trs/v2/tools/toolId');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(del)
    .parse('delete toolId');
});

test.serial.cb('The "download" should download a tool', t => {
  const res = { data: { fileName: 'download.cwl' } };
  getApiStub.onFirstCall().returns(res);
  downloadStub.onFirstCall().returns({tool: 'mock'});
  callback = () => {
    t.is(getApiStub.callCount, 1);
    t.is(getApiStub.getCall(0).args[1], '/v1/trs/files/toolId/download');
    t.is(printSpy.callCount, 1);
    t.is(downloadStub.callCount, 1);
    t.end();
  };

  yargs.command(download)
    .parse('download toolId');
});

test.serial.cb('The "add-version" command should add a version to a tool', t => {
  const res = { data: {} };
  postStub.onCall(0).returns(res);

  const resUpload = { data: { uploadUrl: '/a/test/link' } };
  postStub.onCall(1).returns(resUpload);

  axiosMock.onPut('/a/test/link').reply(200);

  const data = {
    version: '1.5.9',
    isDefault: true
  };

  callback = () => {
    t.is(postStub.callCount, 2);
    t.is(postStub.getCall(0).args[1], '/trs/v2/tools/toolId/versions');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(addVersion)
    .parse('add-version toolId -s 1.5.9 -d true -f "./test/unit/commands/tools/tool-test.js"');
});
