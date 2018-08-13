'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const program = proxyquire('../../../lib/cmds/genomics_cmds/list-variants', {
  '../../ga4gh': {
    get: getStub,
    post: postStub,
    del: delStub
  },
  '../../print': (data, opts) => {
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

test.serial.cb('The "ga4gh-variants" command should list reads for a variantset', t => {
  const res = { data: { reads: [] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/variants/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      variantSetIds: [
        'variantsetid'
      ],
      start: 25,
      end: 35,
      referenceName: 'chrY',
      pageSize: 25,
      pageToken: undefined
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ reads: [] }));
    t.end();
  };

  yargs.command(program)
    .parse('list-variants variantsetid --start 25 --end 35 --reference chrY');
});
