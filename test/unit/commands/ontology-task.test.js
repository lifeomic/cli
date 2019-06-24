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

const createOntologyTask = proxyquire('../../../lib/cmds/tasks_cmds/create-ontology-task', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "create-ontology-task" command should create a ontology ingest task', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/tasks/ontology/import');
    t.deepEqual(postStub.getCall(0).args[2], {
      fileId: 'c8ef7300-1373-4e51-8eb9-ff333600f6a5',
      datasetId: 'db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3',
      type: 'gsea'
    });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(createOntologyTask)
    .parse('create-ontology-import db3e09e9-1ecd-4976-aa5e-70ac7ada0cc3 -f c8ef7300-1373-4e51-8eb9-ff333600f6a5 -o gsea');
});
