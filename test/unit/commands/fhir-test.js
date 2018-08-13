'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');
const streams = require('memory-streams');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const putStub = sinon.stub();
const printSpy = sinon.spy();
const stdinStub = sinon.stub();
let callback;

const mocks = {
  '../../fhir': {
    get: getStub,
    post: postStub,
    del: delStub,
    put: putStub,
    getAccount: () => 'account'
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../stdin': () => stdinStub()
};

const get = proxyquire('../../../lib/cmds/fhir_cmds/get', mocks);
const del = proxyquire('../../../lib/cmds/fhir_cmds/del', mocks);
const list = proxyquire('../../../lib/cmds/fhir_cmds/list', mocks);
const ingest = proxyquire('../../../lib/cmds/fhir_cmds/ingest', mocks);
const searchDel = proxyquire('../../../lib/cmds/fhir_cmds/search-del', mocks);

test.afterEach.always(t => {
  getStub.reset();
  postStub.reset();
  delStub.reset();
  putStub.reset();
  printSpy.resetHistory();
  stdinStub.reset();
  callback = null;
});

function mockStdin (data) {
  const result = new streams.ReadableStream(data);
  return result;
}

test.serial.cb('The "fhir" command should list fhir resources', t => {
  const res = {data: { entry: [] }};
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], 'account/dstu3/Patient/_search');
    t.is(postStub.getCall(0).args[2], 'pageSize=1000');
    t.deepEqual(postStub.getCall(0).args[3], {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], []);
    t.end();
  };

  yargs.command(list)
    .parse('list Patient');
});

test.serial.cb('Limit should set the page size for the "fhir" command', t => {
  const res = {data: { entry: [] }};
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], 'account/dstu3/Patient/_search');
    t.is(postStub.getCall(0).args[2], 'pageSize=10');
    t.deepEqual(postStub.getCall(0).args[3], {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], []);
    t.end();
  };

  yargs.command(list)
    .parse('list Patient --limit 10');
});

test.serial.cb('The "fhir-ingest" command should update a fhir resource', t => {
  const res = {data: {entry: [{response: {location: '/account/dstu3/Patient/1234', status: '200'}}]}};
  postStub.returns(res);

  const data = [{resourceType: 'Patient', id: '1234'}];
  const stdin = mockStdin(JSON.stringify(data) + '\n');
  stdinStub.returns(stdin);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], 'account/dstu3');
    t.deepEqual(postStub.getCall(0).args[2], {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        {
          resource:
          {
            resourceType: 'Patient',
            id: '1234'
          }
        }
      ]
    });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [{response: {location: '/account/dstu3/Patient/1234', status: '200'}}]);
    t.end();
  };

  yargs.command(ingest)
    .parse('ingest');
  stdin.push(null);
});

test.serial.cb('The "fhir-ingest" with dataset command should update a fhir resource with dataset', t => {
  const res = {data: {entry: [{response: {location: '/account/dstu3/Patient/1234', status: '200'}}]}};
  postStub.returns(res);

  const data = [{resourceType: 'Patient', id: '1234'}];
  const stdin = mockStdin(JSON.stringify(data) + '\n');
  stdinStub.returns(stdin);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], 'account/dstu3');
    t.deepEqual(postStub.getCall(0).args[2], {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        {
          resource:
          {
            resourceType: 'Patient',
            id: '1234',
            meta: {
              tag: [
                {
                  system: 'http://lifeomic.com/fhir/dataset',
                  code: 'abc'
                }
              ]
            }
          }
        }
      ]
    });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [{response: {location: '/account/dstu3/Patient/1234', status: '200'}}]);
    t.end();
  };

  yargs.command(ingest)
    .parse('ingest --dataset abc');
  stdin.push(null);
});

test.serial.cb('The "fhir-delete" command should delete a fhir resource', t => {
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], 'account/dstu3/Patient/1234');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], {id: '1234', resourceType: 'Patient'});
    t.end();
  };

  yargs.command(del)
    .parse('delete Patient 1234');
});

test.serial.cb('The "fhir-search-delete" command should delete all fhir resource of a certain type matching a query and dataset', t => {
  yargs.command(searchDel)
    .parse('search-delete Patient --dataset dataset-id --query name=John');

  t.is(delStub.callCount, 1);
  t.is(delStub.getCall(0).args[1], 'account/dstu3/Patient?name=John&_tag=http%3A%2F%2Flifeomic.com%2Ffhir%2Fdataset%7Cdataset-id');
  t.is(printSpy.callCount, 0);
  t.end();
});

test.serial.cb('The "fhir-get" command should get a fhir resource', t => {
  const res = {data: {resourceType: 'Patient', id: '1234'}};
  getStub.onFirstCall().returns(res);

  callback = () => {
    t.is(getStub.callCount, 1);
    t.truthy(getStub.getCall(0).args[0]);
    t.is(getStub.getCall(0).args[1], '/account/dstu3/Patient/1234');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], {id: '1234', resourceType: 'Patient'});
    t.end();
  };

  yargs.command(get)
    .parse('get Patient 1234');
});
