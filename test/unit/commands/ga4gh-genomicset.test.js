'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const postStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const program = proxyquire('../../../lib/cmds/genomics_cmds/create-genomic-set', {
  '../../ga4gh': {
    post: postStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

test.always.afterEach(t => {
  postStub.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "ga4gh-genomicsets-create" should create a genomic set', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/genomicsets');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetId: 'dataset',
      name: 'name',
      variantsFileId: 'variantFile',
      readsFileId: 'bamFile',
      patientId: 'patient',
      referenceSetId: 'GRCh37',
      sequenceType: 'germline'
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(program)
    .parse('create-genomic-set dataset -n name -v variantFile -b bamFile -p patient -r  GRCh37 -t germline');
});
