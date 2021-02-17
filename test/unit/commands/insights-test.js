'use strict';

const uuid = require('uuid');
const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const listStub = sinon.stub();
const printSpy = sinon.spy();
const readStub = sinon.stub();
let callback;

const program = proxyquire('../../../lib/cmds/insights_cmds/query', {
  '../../api': {
    post: postStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
});

const schedule = proxyquire('../../../lib/cmds/insights_cmds/schedule-job', {
  '../../api': {
    post: postStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
});

const listJobsCmd = proxyquire('../../../lib/cmds/insights_cmds/list-jobs', {
  '../../api': {
    list: listStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
});

const getJobCmd = proxyquire('../../../lib/cmds/insights_cmds/get-job', {
  '../../api': {
    get: getStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
});

test.afterEach.always(t => {
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.afterEach.always(t => {
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "insights-run-query" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  readStub.onFirstCall().returns('{}');

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(program)
    .parse('query 1');
});

test.serial.cb('The "insights-run-query" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(program)
    .parse('query 1 --sql "SELECT filter FROM gene"');
});

test.serial.cb('The "insights-run-query" command allows cohort to be used', t => {
  const query = { wicked: 'analyticsQuery' };
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  readStub.onFirstCall().returns(query);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.deepEqual(postStub.getCall(0).args[2], {
      cohort_id: '2',
      query
    });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(program)
    .parse('query 1 --cohortId 2');
});

test.serial.cb('The "schedule-job" command allows a job to be scheduled', t => {
  postStub.onFirstCall().returns({});

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/jobs');
    t.deepEqual(postStub.getCall(0).args[2], {
      type: 'gene',
      action: 'aggregate',
      datasetId: 'projectId',
      setIds: ['set1', 'set2', 'set3']
    });
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(schedule)
    .parse('schedule-job -t gene -a aggregate -p projectId -s set1 set2 set3');
});

test.serial.cb('The "list-jobs" command should accept page-size and next-page-token', t => {
  const pageSize = 30;
  const nextPageToken = uuid();

  listStub.onFirstCall().returns({});
  const expectedPath = `/v1/analytics/jobs?pageSize=${pageSize}&nextPageToken=${nextPageToken}`;

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], expectedPath);
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(listJobsCmd).parse(`list-jobs -n ${pageSize} -t ${nextPageToken}`);
});

test.serial.cb('The "get-job" command should add job-id to path', t => {
  const jobId = uuid();

  getStub.onFirstCall().returns({});
  const expectedPath = `/v1/analytics/jobs/${jobId}`;

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], expectedPath);
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(getJobCmd).parse(`get-job ${jobId}`);
});
