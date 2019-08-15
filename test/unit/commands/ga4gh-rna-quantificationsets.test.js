'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
const listStub = sinon.stub();
let callback;

const mocks = {
  '../../ga4gh': {
    get: getStub,
    post: postStub,
    del: delStub,
    list: listStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const list = proxyquire('../../../lib/cmds/genomics_cmds/list-rna-quantification-sets', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  callback = null;
});

test.serial.cb('The "ga4gh-rnaquantificationsets" command should list rna sets for an account', t => {
  const res = { data: { rnaquantificationsets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/rnaquantificationsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ rnaquantificationsets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-rna-quantification-sets dataset --status INDEXING');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/rnaquantificationsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ rnaquantificationsets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-rna-quantification-sets dataset --status INDEXING -l 1000');
});

test.serial.cb('The "ga4gh-rnaquantificationsets" command should list rna sets for an account filtered by sequence', t => {
  const res = { data: { rnaquantificationsets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/rnaquantificationsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      sequenceId: 'sequenceId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ rnaquantificationsets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-rna-quantification-sets dataset -q sequenceId');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/rnaquantificationsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      sequenceId: 'sequenceId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ rnaquantificationsets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-rna-quantification-sets dataset -q sequenceId -l 1000');
});

test.serial.cb('The "ga4gh-rnaquantificationsets" command should list rna sets for an account filtered by patient', t => {
  const res = { data: { rnaquantificationsets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/rnaquantificationsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      patientId: 'patientId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ rnaquantificationsets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-rna-quantification-sets dataset -p patientId');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/rnaquantificationsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      patientId: 'patientId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ rnaquantificationsets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-rna-quantification-sets dataset -p patientId -l 1000');
});
