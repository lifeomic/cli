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

const queryCmd = proxyquire('../../../lib/cmds/data_lake_cmds/query', {
  '../../api': {
    post: postStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
});

const listCmd = proxyquire('../../../lib/cmds/data_lake_cmds/list-queries', {
  '../../api': {
    list: listStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

const getQueryCmd = proxyquire('../../../lib/cmds/data_lake_cmds/get-query', {
  '../../api': {
    get: getStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

const getSchemasCmd = proxyquire('../../../lib/cmds/data_lake_cmds/list-schemas', {
  '../../api': {
    get: getStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

const getSchemaCmd = proxyquire('../../../lib/cmds/data_lake_cmds/get-schema', {
  '../../api': {
    get: getStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

test.afterEach.always(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  listStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "data-lake-query" command should accept a query as an optional argument', t => {
  const query = "SELECT sample_id, gene, impact, amino_acid_change, histology FROM variant WHERE tumor_site='breast'";
  const datasetId = uuid();
  const outputFileName = 'data-lake-test';

  postStub.onFirstCall().returns({});

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/data-lake/query');
    t.deepEqual(postStub.getCall(0).args[2], {
      query: query,
      datasetId: datasetId,
      outputFileName: outputFileName
    });
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(queryCmd).parse(`query ${datasetId} -q "${query}" -o ${outputFileName}`);
});

test.serial.cb('The "data-lake-query" command should accept a query from stdin', t => {
  const query = "SELECT sample_id, gene, impact, amino_acid_change, histology FROM variant WHERE tumor_site='breast'";
  const datasetId = uuid();
  const outputFileName = 'data-lake-test';

  postStub.onFirstCall().returns({});
  readStub.onFirstCall().returns(query);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/data-lake/query');
    t.deepEqual(postStub.getCall(0).args[2], {
      query: query,
      datasetId: datasetId,
      outputFileName: outputFileName
    });
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(queryCmd).parse(`query ${datasetId} -o ${outputFileName}`);
});

test.serial.cb('The "data-lake-list-queries" command should accept page-size and next-page-token', t => {
  const datasetId = uuid();
  const pageSize = 30;
  const nextPageToken = uuid();

  listStub.onFirstCall().returns({});
  const expectedPath = `/v1/analytics/data-lake/query?datasetId=${datasetId}&pageSize=${pageSize}&nextPageToken=${nextPageToken}`;

  callback = () => {
    t.is(listStub.callCount, 1);
    t.is(listStub.getCall(0).args[1], expectedPath);
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(listCmd).parse(`list-queries ${datasetId} -n ${pageSize} -t ${nextPageToken}`);
});

test.serial.cb('The "data-lake-get-query" command should add query-id to path', t => {
  const queryId = uuid();

  getStub.onFirstCall().returns({});
  const expectedPath = `/v1/analytics/data-lake/query/${queryId}`;

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], expectedPath);
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(getQueryCmd).parse(`get-query ${queryId}`);
});

test.serial.cb('The "data-lake-list-schemas" command should add dataset id to path', t => {
  const datasetId = uuid();

  getStub.onFirstCall().returns({});
  const expectedPath = `/v1/analytics/data-lake/schema?datasetId=${datasetId}`;

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], expectedPath);
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(getSchemasCmd).parse(`list-schemas ${datasetId}`);
});

test.serial.cb('The "data-lake-get-schema" command should add dataset id and table name to path', t => {
  const datasetId = uuid();
  const tableName = 'condition';

  getStub.onFirstCall().returns({});
  const expectedPath = `/v1/analytics/data-lake/schema/${tableName}?datasetId=${datasetId}`;

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], expectedPath);
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(getSchemaCmd).parse(`get-schema ${datasetId} -t ${tableName}`);
});
