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

const get = proxyquire('../../../lib/cmds/genomics_cmds/get-variant-set', mocks);
const del = proxyquire('../../../lib/cmds/genomics_cmds/delete-variant-set', mocks);
const list = proxyquire('../../../lib/cmds/genomics_cmds/list-variant-sets', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  callback = null;
});

test.serial.cb('The "ga4gh-variantsets" command should list variantsets for an account', t => {
  const res = { data: { variantSets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/variantsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ variantSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-variant-sets dataset --status INDEXING');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/variantsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ variantSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-variant-sets dataset --status INDEXING -l 1000');
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

  yargs.command(get)
    .parse('get-variant-set variantsetid');
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

  yargs.command(del)
    .parse('delete-variant-set variantsetid');
});

test.serial.cb('The "ga4gh-variantsets" command should list variantsets for an account filtered by sequence', t => {
  const res = { data: { variantSets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/variantsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      sequenceId: 'sequenceId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ variantSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-variant-sets dataset -q sequenceId');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/variantsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      sequenceId: 'sequenceId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ variantSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-variant-sets dataset -q sequenceId -l 1000');
});

test.serial.cb('The "ga4gh-variantsets" command should list variantsets for an account filtered by patient', t => {
  const res = { data: { variantSets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/variantsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      patientId: 'patientId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ variantSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-variant-sets dataset -p patientId');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/variantsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      patientId: 'patientId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ variantSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-variant-sets dataset -p patientId -l 1000');
});
