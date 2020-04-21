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

const get = proxyquire('../../../lib/cmds/genomics_cmds/get-structural-variant-set', mocks);
const del = proxyquire('../../../lib/cmds/genomics_cmds/delete-structural-variant-set', mocks);
const list = proxyquire('../../../lib/cmds/genomics_cmds/list-structural-variant-sets', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  callback = null;
});

test.serial.cb('The "list-structural-variant-sets" command should list structural variant sets for an account', t => {
  const res = { data: { fusionSets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/fusionsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ fusionSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-structural-variant-sets dataset --status INDEXING');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/fusionsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ fusionSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-structural-variant-sets dataset --status INDEXING -l 1000');
});

test.serial.cb('The "get-structural-variant-set" should get a structural variant', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/fusionsets/fusionsetid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get-structural-variant-set fusionsetid');
});

test.serial.cb('The "delete-structural-variant-set" should delete a structural variant', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/fusionsets/fusionsetid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(del)
    .parse('delete-structural-variant-set fusionsetid');
});

test.serial.cb('The "list-structural-variant-sets" command should list structural variant sets for an account filtered by sequence', t => {
  const res = { data: { fusionSets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/fusionsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      sequenceId: 'sequenceId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ fusionSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-structural-variant-sets dataset -q sequenceId');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/fusionsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      sequenceId: 'sequenceId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ fusionSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-structural-variant-sets dataset -q sequenceId -l 1000');
});

test.serial.cb('The "list-structural-variant-sets" command should list structural variant sets for an account filtered by patient', t => {
  const res = { data: { fusionSets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/fusionsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      patientId: 'patientId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ fusionSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-structural-variant-sets dataset -p patientId');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/fusionsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      patientId: 'patientId'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ fusionSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-structural-variant-sets dataset -p patientId -l 1000');
});
