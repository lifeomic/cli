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

const get = proxyquire('../../../lib/cmds/genomics_cmds/get-readgroup-set', mocks);
const del = proxyquire('../../../lib/cmds/genomics_cmds/delete-readgroup-set', mocks);
const list = proxyquire('../../../lib/cmds/genomics_cmds/list-readgroup-sets', mocks);

test.afterEach.always(t => {
  getStub.reset();
  postStub.reset();
  delStub.reset();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "ga4gh-readgroupsets" command should list readgroupsets for an account', t => {
  const res = { data: { readGroupSets: [] } };
  postStub.onFirstCall().returns(res);
  listStub.onFirstCall().returns(res);
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

  yargs.command(list)
    .parse('list-readgroup-sets dataset');

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], '/readgroupsets/search');
    t.deepEqual(listStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ]
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ readGroupSets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-readgroup-sets dataset -l 1000');
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

  yargs.command(get)
    .parse('get-readgroup-set readgroupsetid');
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

  yargs.command(del)
    .parse('delete-readgroup-set readgroupsetid');
});
