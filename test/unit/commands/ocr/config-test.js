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

const get = proxyquire('../../../../lib/cmds/ocr_cmds/get-config', mocks);
const del = proxyquire('../../../../lib/cmds/ocr_cmds/delete-config', mocks);
const create = proxyquire('../../../../lib/cmds/ocr_cmds/create-config', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  delStub.resetHistory();
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "ocr get-config" command should get an ocr config', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/ocr/config/1');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get-config 1');
});

test.serial.cb('The "ocr create-config" command should create an ocr config', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = {
    project: '0a14cd67-00ad-4f58-a197-46f67874d300',
    config: {
      denoiserSwitch: 'SMART',
      pathPrefix: 'ocr-test'
    }
  };
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/ocr/config');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(create)
    .parse('create-config 0a14cd67-00ad-4f58-a197-46f67874d300 --denoiserSwitch "SMART" --pathPrefix "ocr-test"');
});

test.serial.cb('The "ocr delete-config" command should remove ocr config', t => {
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/v1/ocr/config/1');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], 'Deleted ocr config: 1');
    t.end();
  };

  yargs.command(del)
    .parse('delete-config 1');
});
