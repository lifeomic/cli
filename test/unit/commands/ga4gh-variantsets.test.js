'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const program = proxyquire('../../../lib/commands/ga4gh-variantsets', {
  '../ga4gh': {
    get: getStub,
    post: postStub,
    del: delStub
  },
  '../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "ga4gh-variantsets" command should list variantsets for an account', t => {
  const res = { data: { variantSets: [] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/variantsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ variantSets: [] }));
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-variantsets', 'dataset']);
});

test.serial.cb('The "ga4gh-variantsets-get" should get a variantset', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/variantsets/variantsetid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-variantsets-get', 'variantsetid']);
});

test.serial.cb('The "ga4gh-variantsets-delete" should delete a variantset', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/variantsets/variantsetid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-variantsets-delete', 'variantsetid']);
});

test.serial.cb('The "ga4gh-variantsets-create" should create a variantset', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/variantsets');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetId: 'dataset',
      name: 'name',
      fileId: 'file',
      patientId: 'patient'
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-variantsets-create', 'dataset', '-n', 'name', '-f', 'file', '-p', 'patient']);
});
