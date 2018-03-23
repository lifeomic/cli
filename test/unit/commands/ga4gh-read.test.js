'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const program = proxyquire('../../../lib/commands/ga4gh-read', {
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

test.serial.cb('The "ga4gh-reads" command should list reads for a readgroupset', t => {
  const res = { data: { reads: [] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/reads/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      readGroupSetIds: [
        'readgroupsetid'
      ],
      start: 25,
      end: 35,
      referenceName: 'chrY',
      pageSize: 5,
      pageToken: undefined
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ reads: [] }));
    t.end();
  };

  program.parse(['node', 'lo', 'ga4gh-reads', 'readgroupsetid', '--start', '25', '--end', '35', '--reference', 'chrY']);
});
