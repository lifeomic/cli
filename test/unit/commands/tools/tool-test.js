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
const multipartUploadStub = sinon.stub();
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
    get: getApiStub,
    multipartUpload: multipartUploadStub
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
  multipartUploadStub.resetHistory();
  callback = null;
  delete process.env.TOOL_MULTIPART_MIN_SIZE;
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

test.serial.cb('The "create" command should create a tool with multi-part upload', t => {
  const toolName = 'tool_name';
  const description = 'docker image';
  const access = 'ACCOUNT';
  const type = 'Image';
  const label = 'test';
  const uploadId = '00000000-dead-beef-0000-000000000000';
  const toolId = '00000000-cafe-d00d-0000-000000000000';
  const version = '0.0.0';
  const fileName = 'file1.txt';

  const createToolData = {
    name: toolName,
    description: description,
    access: access,
    version: version,
    toolClassId: '11',
    descriptorType: type.toUpperCase(),
    labels: [label]
  };

  const requestIdData = {
    fileName: fileName,
    toolId: toolId,
    version: version
  };

  process.env.TOOL_MULTIPART_MIN_SIZE = 3;

  // create the tool
  const res = { data: { id: toolId, meta_version: version } };
  postStub.onCall(0).returns(res);

  // requset the upload id
  const resUpload = { data: { uploadId: uploadId } };
  postStub.onCall(1).returns(resUpload);

  callback = () => {
    t.is(postStub.callCount, 2);
    t.is(postStub.getCall(0).args[1], '/trs/v2/tools');
    t.deepEqual(postStub.getCall(0).args[2], createToolData);
    t.is(postStub.getCall(1).args[1], '/trs/uploads');
    t.deepEqual(postStub.getCall(1).args[2], requestIdData);
    t.end();
  };

  yargs.command(create)
    .parse(`create -n ${toolName}  -d "${description}" -a ${access} -t ${type} -s ${version} -l "${label}" -f ./test/unit/commands/data/${fileName}`);
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
