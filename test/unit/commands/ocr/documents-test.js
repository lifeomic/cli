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

const create = proxyquire('../../../../lib/cmds/ocr_cmds/create-document', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  delStub.resetHistory();
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "ocr create-document" command should create an ocr document', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = {
    project: 'project-id',
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
    .parse('create-document project-id file-id');
});

test.serial.cb('The "ocr create-document" command should create an ocr document with subjectId', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = {
    project: 'project-id',
    fileId: 'file-id',
    subject: 'subject-id'
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
    .parse('create-document project-id file-id -s subject-id');
});
