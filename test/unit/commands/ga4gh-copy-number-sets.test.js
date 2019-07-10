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

const get = proxyquire('../../../lib/cmds/genomics_cmds/get-copy-number-set', mocks);
const del = proxyquire('../../../lib/cmds/genomics_cmds/delete-copy-number-set', mocks);
const list = proxyquire('../../../lib/cmds/genomics_cmds/list-copy-number-sets', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  listStub.resetHistory();
  callback = null;
});

test.serial.cb('The "list-copy-number-sets" command should list copy number set sets for an account', t => {
  const res = { data: { copyNumberSets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/copynumbersets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ copyNumberSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-copy-number-sets dataset --status INDEXING');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/copynumbersets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ copyNumberSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-copy-number-sets dataset --status INDEXING -l 1000');
});

test.serial.cb('The "get-copy-number-set" should get a copy number set', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/copynumbersets/copynumbersetid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get-copy-number-set copynumbersetid');
});

test.serial.cb('The "delete-copy-number-set" should delete a copy number set', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/copynumbersets/copynumbersetid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(del)
    .parse('delete-copy-number-set copynumbersetid');
});
