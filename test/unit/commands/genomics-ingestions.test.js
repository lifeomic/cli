'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const printSpy = sinon.stub();
let callback;

const mocks = {
  '../../../api': {
    get: getStub,
    post: postStub
  },
  '../../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const get = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/get', mocks);
const list = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/list', mocks);
const createFoundation = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/create-foundation', mocks);
const createCaris = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/create-caris', mocks);
const createFoundationBam = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/create-foundation-bam', mocks);
const createCarisBam = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/create-caris-bam', mocks);
const createNextGen = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/create-nextgen', mocks);
const getByGermlineCaseId = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/get-by-germline-case-id', mocks);
const createVcf = proxyquire('../../../lib/cmds/genomics_cmds/ingestions_cmds/create-vcf', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "get" command should get an ingestion based on project id and ingestion id', t => {
  const res = { data: { id: 'ingestionId' } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions/ingestionId');
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ id: 'ingestionId' }));
    t.end();
  };

  yargs.command(get).parse('get projectId ingestionId');
});

test.serial.cb('The "list" command should return ingestions based on project id', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions?pageSize=1&nextPageToken=token&name=foo&steps=Submitted');
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ items: [] }));
    t.end();
  };

  yargs.command(list).parse('list projectId -n 1 -t token --name foo --failed false --step Submitted');
});

test.serial.cb('The "get-by-germline-case-id" command should get an ingestion based on project id and germline case id', t => {
  const res = { data: { id: 'ingestionId' } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions/germline-cases/germlineCaseId');
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ id: 'ingestionId' }));
    t.end();
  };

  yargs.command(getByGermlineCaseId).parse('get-by-germline-case projectId germlineCaseId');
});

test.serial.cb('The "create-foundation" command should create a Foundation ingestion', t => {
  const res = { data: { id: 'ingestionId' } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions');
    t.deepEqual(postStub.getCall(0).args[2], {
      ingestionType: 'Foundation',
      inputFiles: {
        xml: 'xmlFileId',
        vcf: 'vcfFileId',
        report: 'reportFileId'
      },
      notificationConfig: {
        succeededEmail: 'succeeded@test.com',
        failedEmail: 'failed@test.com'
      }
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ id: 'ingestionId' }));
    t.end();
  };

  yargs.command(createFoundation).parse('create-foundation projectId xmlFileId reportFileId vcfFileId --succeededEmail succeeded@test.com --failedEmail failed@test.com');
});

test.serial.cb('The "create-caris" command should create a Caris ingestion', t => {
  const res = { data: { id: 'ingestionId' } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions');
    t.deepEqual(postStub.getCall(0).args[2], {
      ingestionType: 'Caris',
      inputFiles: {
        tar: 'tarFileId'
      },
      notificationConfig: {
        succeededEmail: undefined,
        failedEmail: undefined
      }
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ id: 'ingestionId' }));
    t.end();
  };

  yargs.command(createCaris).parse('create-caris projectId tarFileId');
});

test.serial.cb('The "create-foundation-bam" command should create a Foundation BAM ingestion', t => {
  const res = { data: { id: 'ingestionId' } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions');
    t.deepEqual(postStub.getCall(0).args[2], {
      ingestionType: 'FoundationBam',
      inputFiles: {
        bam: 'bamFileId'
      },
      notificationConfig: {
        succeededEmail: undefined,
        failedEmail: undefined
      }
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ id: 'ingestionId' }));
    t.end();
  };

  yargs.command(createFoundationBam).parse('create-foundation-bam projectId bamFileId');
});

test.serial.cb('The "create-caris-bam" command should create a Caris BAM ingestion', t => {
  const res = { data: { id: 'ingestionId' } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions');
    t.deepEqual(postStub.getCall(0).args[2], {
      ingestionType: 'CarisBam',
      inputFiles: {
        bam: 'bamFileId'
      },
      notificationConfig: {
        succeededEmail: undefined,
        failedEmail: undefined
      }
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ id: 'ingestionId' }));
    t.end();
  };

  yargs.command(createCarisBam).parse('create-caris-bam projectId bamFileId');
});

test.serial.cb('The "create-nextgen" command should create a NextGen ingestion', t => {
  const res = { data: { id: 'ingestionId' } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions');
    t.deepEqual(postStub.getCall(0).args[2], {
      ingestionType: 'NextGen',
      inputFiles: {
        tar: 'tarFileId'
      },
      notificationConfig: {
        succeededEmail: undefined,
        failedEmail: undefined
      }
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ id: 'ingestionId' }));
    t.end();
  };

  yargs.command(createNextGen).parse('create-nextgen projectId tarFileId');
});

test.serial.cb('The "create-vcf" command should create a VCF ingestion', t => {
  const res = { data: { id: 'ingestionId' } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/genomic-ingestion/projects/projectId/ingestions');
    t.deepEqual(postStub.getCall(0).args[2], {
      ingestionType: 'Vcf',
      inputFiles: {
        vcf: 'vcfFileId',
        manifest: 'manifestFileId'
      },
      notificationConfig: {
        succeededEmail: 'test@testing.com',
        failedEmail: 'test@testing.com'
      }
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ id: 'ingestionId' }));
    t.end();
  };

  yargs.command(createVcf).parse('create-vcf projectId vcfFileId manifestFileId --succeededEmail test@testing.com --failedEmail test@testing.com');
});
