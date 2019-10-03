'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const yargs = require('yargs');
const getStub = sinon.stub();
const postStub = sinon.stub();
const printSpy = sinon.spy();
const readStub = sinon.stub();
let callback;

const mocks = {
  '../../api': {
    get: getStub,
    post: postStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
};

const get = proxyquire('../../../lib/cmds/tasks_cmds/get', mocks);
const cancel = proxyquire('../../../lib/cmds/tasks_cmds/cancel', mocks);
const list = proxyquire('../../../lib/cmds/tasks_cmds/list', mocks);
const create = proxyquire('../../../lib/cmds/tasks_cmds/create', mocks);
const createFoundationTask = proxyquire('../../../lib/cmds/tasks_cmds/create-foundation-task', mocks);
const createNantomicsTask = proxyquire('../../../lib/cmds/tasks_cmds/create-nantomics-task', mocks);
const createAshionTask = proxyquire('../../../lib/cmds/tasks_cmds/create-ashion-task', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "tasks" command should list tasks for an account', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/tasks?pageSize=25&nextPageToken=&datasetId=1');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list 1');
});

test.serial.cb('The "tasks-get" command should fetch a task', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/tasks/taskid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get taskid');
});

test.serial.cb('The "tasks-create" command should create a task', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = { name: 'my task' };
  readStub.onFirstCall().returns(data);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks');
    t.deepEqual(postStub.getCall(0).args[2], data);
    t.end();
  };

  yargs.command(create)
    .parse('create');
});

test.serial.cb('The "create-foundation-xml-import" command should create a foundation ingest task', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks/system/foundation-xml-import');
    t.deepEqual(postStub.getCall(0).args[2], {
      xmlFileId: 'c8ef7300-1373-4e51-8eb9-ff333600f6a5',
      datasetId: 'db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3',
      reportFileId: '1234',
      subjectId: '2a6dc73e-ed30-4387-94c1-0cd661da56d9',
      sequenceName: 'test3',
      testType: 'test1',
      performerId: 'performer1',
      indexedDate: '1999-01-01 12:00',
      indexType: 'all',
      reIngestFile: false,
      bodySite: 'Colon',
      bodySiteSystem: 'http://a.fancy.system.com',
      bodySiteDisplay: 'body site notation'
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(createFoundationTask)
    .parse('create-foundation-xml-import db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3 -x c8ef7300-1373-4e51-8eb9-ff333600f6a5 ' +
      '-r 1234 -s 2a6dc73e-ed30-4387-94c1-0cd661da56d9 -n test3 --test-type test1 --performer-id performer1 ' +
      '--indexed-date "1999-01-01 12:00" --index-type all --body-site "Colon" --body-site-system "http://a.fancy.system.com" ' +
      '--body-site-display "body site notation"');
});

test.serial.cb('The "create-foundation-xml-import" accepts re-ingest-file as an optional boolean flag', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks/system/foundation-xml-import');
    t.deepEqual(postStub.getCall(0).args[2], {
      xmlFileId: 'c8ef7300-1373-4e51-8eb9-ff333600f6a5',
      datasetId: 'db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3',
      reportFileId: '1234',
      subjectId: '2a6dc73e-ed30-4387-94c1-0cd661da56d9',
      sequenceName: 'test3',
      testType: 'test1',
      performerId: 'performer1',
      indexedDate: '1999-01-01 12:00',
      indexType: 'all',
      reIngestFile: true,
      bodySite: 'Colon',
      bodySiteSystem: 'http://a.fancy.system.com',
      bodySiteDisplay: 'body site notation'
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(createFoundationTask)
    .parse('create-foundation-xml-import db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3 -x c8ef7300-1373-4e51-8eb9-ff333600f6a5 ' +
      '-r 1234 -s 2a6dc73e-ed30-4387-94c1-0cd661da56d9 -n test3 --test-type test1 --performer-id performer1 ' +
      '--indexed-date "1999-01-01 12:00" --index-type all --re-ingest-file --body-site "Colon" ' +
      '--body-site-system "http://a.fancy.system.com"  --body-site-display "body site notation"');
});

test.serial.cb('The "create-ashion-import" command should create a ashion ingest task', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks/system/ashion-import');
    t.deepEqual(postStub.getCall(0).args[2], {
      tarFileId: 'c8ef7300-1373-4e51-8eb9-ff333600f6a5',
      datasetId: 'db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3',
      subjectId: '2a6dc73e-ed30-4387-94c1-0cd661da56d9',
      performerId: 'performer1',
      indexedDate: '1999-01-01 12:00',
      outputFilePrefix: 'prefix',
      bodySite: 'Colon',
      bodySiteSystem: 'http://a.fancy.system.com',
      bodySiteDisplay: 'body site notation',
      reIngestFile: true
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(createAshionTask)
    .parse('create-ashion-import db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3 -f c8ef7300-1373-4e51-8eb9-ff333600f6a5 ' +
      '-s 2a6dc73e-ed30-4387-94c1-0cd661da56d9 --performer-id performer1 --indexed-date "1999-01-01 12:00" ' +
      '--output-prefix prefix --body-site "Colon" --body-site-system "http://a.fancy.system.com"  ' +
      '--body-site-display "body site notation" --re-ingest-file');
});
test.serial.cb('The "create-nantomics-vcf-import" command should create a Nantomics ingest task', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks/system/nantomics-vcf-import');
    t.deepEqual(postStub.getCall(0).args[2], {
      nantomicsVcfFileId: 'c8ef7300-1373-4e51-8eb9-ff333600f6a5',
      datasetId: 'db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3',
      outputFilePrefix: 'converted',
      subjectId: '2a6dc73e-ed30-4387-94c1-0cd661da56d9',
      sequenceType: 'germline',
      sequenceName: 'test4',
      testType: 'test1',
      performerId: 'performer1',
      indexedDate: '1999-01-01 12:00',
      uploadType: 'variant',
      reIngestFile: false,
      bodySite: 'Colon',
      bodySiteSystem: 'http://a.fancy.system.com',
      bodySiteDisplay: 'body site notation'
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(createNantomicsTask)
    .parse('create-nantomics-vcf-import db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3 -v c8ef7300-1373-4e51-8eb9-ff333600f6a5 ' +
      '-p converted -s 2a6dc73e-ed30-4387-94c1-0cd661da56d9 -e germline -n test4  --test-type test1 ' +
      '--performer-id performer1 --indexed-date "1999-01-01 12:00" --upload-type variant --body-site "Colon" ' +
      '--body-site-system "http://a.fancy.system.com"  --body-site-display "body site notation"');
});

test.serial.cb('The "create-nantomics-vcf-import" command accepts re-ingest-file as an optional boolean flag', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks/system/nantomics-vcf-import');
    t.deepEqual(postStub.getCall(0).args[2], {
      nantomicsVcfFileId: 'c8ef7300-1373-4e51-8eb9-ff333600f6a5',
      datasetId: 'db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3',
      outputFilePrefix: 'converted',
      subjectId: '2a6dc73e-ed30-4387-94c1-0cd661da56d9',
      sequenceType: 'germline',
      sequenceName: 'test4',
      testType: 'test1',
      performerId: 'performer1',
      indexedDate: '1999-01-01 12:00',
      uploadType: 'variant',
      reIngestFile: true,
      bodySite: 'Colon',
      bodySiteSystem: 'http://a.fancy.system.com',
      bodySiteDisplay: 'body site notation'
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(createNantomicsTask)
    .parse('create-nantomics-vcf-import db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3 -v c8ef7300-1373-4e51-8eb9-ff333600f6a5 ' +
      '-p converted -s 2a6dc73e-ed30-4387-94c1-0cd661da56d9 -e germline -n test4  --test-type test1 --performer-id performer1 ' +
      '--indexed-date "1999-01-01 12:00" --upload-type variant  --re-ingest-file --body-site "Colon" ' +
      '--body-site-system "http://a.fancy.system.com" --body-site-display "body site notation"');
});

test.serial.cb('The "tasks-cancel" command should cancel a task', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks/taskId:cancel');
    t.end();
  };

  yargs.command(cancel)
    .parse('cancel taskId');
});
