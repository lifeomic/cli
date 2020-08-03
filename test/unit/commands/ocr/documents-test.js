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

const list = proxyquire('../../../../lib/cmds/ocr_cmds/list-documents', mocks);
const get = proxyquire('../../../../lib/cmds/ocr_cmds/get-document', mocks);
const del = proxyquire('../../../../lib/cmds/ocr_cmds/delete-document', mocks);
const create = proxyquire('../../../../lib/cmds/ocr_cmds/create-document', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  delStub.resetHistory();
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "ocr list-document" command should list documents', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/ocr/documents?project=project-id&subject=subject-id&fileId=&documentReference=&pageSize=25&nextPageToken=');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list-documents project-id -s subject-id');
});

test.serial.cb('The "ocr get-document" command should get an ocr document', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/ocr/documents/document-id?project=project-id');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get-document project-id document-id');
});

test.serial.cb('The "ocr create-document" command should create an ocr document', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = {
    project: 'project-id',
    subject: 'subject-id',
    fileId: 'file-id'
  };
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/ocr/documents');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(create)
    .parse('create-document project-id subject-id file-id');
});

test.serial.cb('The "ocr delete-document" command should remove ocr document', t => {
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/v1/ocr/documents/document-id?project=project-id');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], 'Deleted ocr document: document-id');
    t.end();
  };

  yargs.command(del)
    .parse('delete-document project-id document-id');
});
