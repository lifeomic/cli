'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const program = proxyquire('../../../lib/commands/ga4gh-readgroupset', {
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
  getStub.reset();
  postStub.reset();
  delStub.reset();
  printSpy.reset();
  callback = null;
});

test.serial.cb('The "ga4gh-readgroupsets" command should list readgroupsets for an account', t => {
  const res = { data: { readGroupSets: [] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/readgroupsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ readGroupSets: [] }));
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-readgroupsets', 'dataset']);
});

test.serial.cb('The "ga4gh-readgroupsets-get" should get a readgroupset', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/readgroupsets/readgroupsetid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-readgroupsets-get', 'readgroupsetid']);
});

test.serial.cb('The "ga4gh-readgroupsets-delete" should delete a readgroupset', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/readgroupsets/readgroupsetid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-readgroupsets-delete', 'readgroupsetid']);
});

test.serial.cb('The "ga4gh-readgroupsets-create" should create a readgroupset', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/readgroupsets');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetId: 'dataset',
      name: 'name',
      sequenceType: 'dna',
      fileId: 'file',
      patientId: 'patient'
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-readgroupsets-create', 'dataset', '-n', 'name', '-f', 'file', '-p', 'patient']);
});
