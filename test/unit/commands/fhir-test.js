'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const putStub = sinon.stub();
const printSpy = sinon.spy();
const readStub = sinon.stub();
let callback;

const program = proxyquire('../../../lib/commands/fhir', {
  '../fhir': {
    get: getStub,
    post: postStub,
    del: delStub,
    put: putStub
  },
  '../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../config': {
    getEnvironment: () => 'dev',
    get: () => 'account'
  },
  '../read': async () => readStub()
});

test.afterEach.always(t => {
  getStub.reset();
  postStub.reset();
  delStub.reset();
  putStub.reset();
  printSpy.reset();
  readStub.reset();
  callback = null;
});

test.serial.cb('The "fhir" command should list fhir resources', t => {
  const res = {data: { entry: [] }};
  getStub.onFirstCall().returns(res);

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], 'account/dstu3/Patient?pageSize=1000');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], []);
    t.end();
  };

  program.parse(['node', 'lo', 'fhir', 'Patient']);
});

test.serial.cb('Limit should set the page size for the "fhir" command', t => {
  const res = {data: { entry: [] }};
  getStub.onFirstCall().returns(res);

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], 'account/dstu3/Patient?pageSize=10');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], []);
    t.end();
  };

  program.parse(['node', 'lo', 'fhir', '--limit', '10', 'Patient']);
});

test.serial.cb('The "fhir-ingest" with command should update a fhir resource', t => {
  const res = {data: {entry: [{location: '/account/dstu3/Patient/1234', status: '200'}]}};
  postStub.returns(res);

  const data = [{resourceType: 'Patient', id: '1234'}];
  readStub.onFirstCall().returns(data);

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
    t.deepEqual(printSpy.getCall(0).args[0], [{location: '/account/dstu3/Patient/1234', status: '200'}]);
    t.end();
  };

  program.parse(['node', 'lo', 'fhir-ingest']);
});

test.serial.cb('The "fhir-ingest" with dataset command should update a fhir resource with dataset', t => {
  const res = {data: {entry: [{location: '/account/dstu3/Patient/1234', status: '200'}]}};
  postStub.returns(res);

  const data = [{resourceType: 'Patient', id: '1234'}];
  readStub.onFirstCall().returns(data);

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
    t.deepEqual(printSpy.getCall(0).args[0], [{location: '/account/dstu3/Patient/1234', status: '200'}]);
    t.end();
  };

  program.parse(['node', 'lo', 'fhir-ingest', '--dataset', 'abc']);
});

test.serial.cb('The "fhir-delete" command should delete a fhir resource', t => {
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], 'account/dstu3/Patient/1234');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], {id: '1234', resourceType: 'Patient'});
    t.end();
  };

  program.parse(['node', 'lo', 'fhir-delete', 'Patient', '1234']);
});

test.serial.cb('The "fhir-delete-all" command should delete all fhir resource of a certain type in a single dataset', t => {
  const res = {
    data: {
      entry: [
        { resource: {resourceType: 'Patient', id: '1234'} },
        { resource: {resourceType: 'Patient', id: '5678'} }
      ]
    }
  };
  getStub.onFirstCall().returns(res);

  callback = () => {
    t.is(delStub.callCount, 2);
    t.is(delStub.getCall(0).args[1], 'account/dstu3/Patient/1234');
    t.is(delStub.getCall(1).args[1], 'account/dstu3/Patient/5678');
    t.is(printSpy.callCount, 1);
    t.deepEqual(getStub.getCall(0).args[1], 'account/dstu3/Patient?_tag=http%3A%2F%2Flifeomic.com%2Ffhir%2Fdataset%7Cdataset-id&pageSize=10');
    t.end();
  };

  program.parse(['node', 'lo', 'fhir-delete-all', 'dataset-id', 'Patient']);
});

test.serial.cb('The "fhir-get" command should get a fhir resource', t => {
  const res = {data: {resourceType: 'Patient', id: '1234'}};
  getStub.onFirstCall().returns(res);

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], 'account/dstu3/Patient/1234');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], {id: '1234', resourceType: 'Patient'});
    t.end();
  };

  program.parse(['node', 'lo', 'fhir-get', 'Patient', '1234']);
});
