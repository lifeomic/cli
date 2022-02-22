'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');
const fs = require('fs');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const putStub = sinon.stub();
const printSpy = sinon.spy();
const stdinStub = sinon.stub();
let callback;

const mocks = {
  '../../api': {
    post: postStub
  },
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
const sql = proxyquire('../../../lib/cmds/fhir_cmds/sql', mocks);
const me = proxyquire('../../../lib/cmds/fhir_cmds/me', mocks);

test.afterEach.always(t => {
  getStub.reset();
  postStub.reset();
  delStub.reset();
  putStub.reset();
  printSpy.resetHistory();
  stdinStub.reset();
  callback = null;
});

test.serial.cb('The "fhir" command should list fhir resources', t => {
  const res = { data: { entry: [{ 'resource': { 'resourceType': 'Patient', 'id': 'ABC1234' } }] } };
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], 'account/dstu3/Patient/_search');
    t.is(postStub.getCall(0).args[2], '_tag=http%3A%2F%2Flifeomic.com%2Ffhir%2Fdataset%7CprojectId&pageSize=500');
    t.deepEqual(postStub.getCall(0).args[3], { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [{ 'resourceType': 'Patient', 'id': 'ABC1234' }]);
    t.end();
  };

  yargs.command(list)
    .parse('list Patient --project projectId');
});

test.serial.cb('The "fhir" command should list fhir resources with a query expression', t => {
  const res = { data: { entry: [{ 'resource': { 'resourceType': 'Patient', 'id': 'ABC1234' } }] } };
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], 'account/dstu3/Patient/_search');
    t.is(postStub.getCall(0).args[2], '_tag=http%3A%2F%2Flifeomic.com%2Ffhir%2Ftag%7Cvalue&_tag=http%3A%2F%2Flifeomic.com%2Ffhir%2Fdataset%7CprojectId&pageSize=500');
    t.deepEqual(postStub.getCall(0).args[3], { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [{ 'resourceType': 'Patient', 'id': 'ABC1234' }]);
    t.end();
  };

  yargs.command(list)
    .parse('list Patient --project projectId --query "_tag=http://lifeomic.com/fhir/tag|value"');
});

test.serial.cb('Limit should set the page size for the "fhir" command', t => {
  const res = { data: { entry: [{ 'resource': { 'resourceType': 'Patient', 'id': 'ABC1234' } }] } };
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], 'account/dstu3/Patient/_search');
    t.is(postStub.getCall(0).args[2], '_tag=http%3A%2F%2Flifeomic.com%2Ffhir%2Fdataset%7CprojectId&pageSize=10');
    t.deepEqual(postStub.getCall(0).args[3], { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [{ 'resourceType': 'Patient', 'id': 'ABC1234' }]);
    t.end();
  };

  yargs.command(list)
    .parse('list Patient --project projectId --limit 10');
});

test.serial.cb('Limit should restrict to a max page size for the "fhir" command', t => {
  const res = { data: { entry: [{ 'resource': { 'resourceType': 'Patient', 'id': 'ABC1234' } }] } };
  postStub.onFirstCall().returns(res);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], 'account/dstu3/Patient/_search');
    t.is(postStub.getCall(0).args[2], '_tag=http%3A%2F%2Flifeomic.com%2Ffhir%2Fdataset%7CprojectId&pageSize=500');
    t.deepEqual(postStub.getCall(0).args[3], { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [{ 'resourceType': 'Patient', 'id': 'ABC1234' }]);
    t.end();
  };

  yargs.command(list)
    .parse('list Patient --project projectId --limit 10000');
});

test.serial.cb('The "fhir-ingest" command should update a fhir resource', t => {
  const res = { data: { entry: [{ response: { location: '/account/dstu3/Patient/1234', status: '200' } }] } };
  postStub.returns(res);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const stdin = fs.createReadStream(`${__dirname}/fhir/array.json`);
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
    t.deepEqual(printSpy.getCall(0).args[0], [{ response: { location: '/account/dstu3/Patient/1234', status: '200' } }]);
    t.end();
  };

  yargs.command(ingest)
    .parse('ingest');
});

test.serial.cb('The "fhir-ingest" with project command should update a fhir resource with dataset', t => {
  const res = { data: { entry: [{ response: { location: '/account/dstu3/Patient/1234', status: '200' } }] } };
  postStub.returns(res);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const stdin = fs.createReadStream(`${__dirname}/fhir/object.json`);
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
    t.deepEqual(printSpy.getCall(0).args[0], [{ response: { location: '/account/dstu3/Patient/1234', status: '200' } }]);
    t.end();
  };

  yargs.command(ingest)
    .parse('ingest --project abc');
});

test.serial.cb('The "fhir-ingest" command can accept CSV stdin given a CSV configuration', t => {
  const res = { data: { entry: [{ response: { location: '/account/dstu3/Patient/1234', status: '200' } }] } };
  postStub.returns(res);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const stdin = fs.createReadStream(`${__dirname}/fhir/csvInput.csv`);
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
            name: [{
              family: 'LastName'
            }]
          }
        }
      ]
    });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [{ response: { location: '/account/dstu3/Patient/1234', status: '200' } }]);
    t.end();
  };

  yargs.command(ingest)
    .parse('ingest --csv ./test/unit/commands/fhir/csvFormat.json');
});

test.serial.cb('The "fhir-delete" command should delete a fhir resource', t => {
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], 'account/dstu3/Patient/1234');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { id: '1234', resourceType: 'Patient' });
    t.end();
  };

  yargs.command(del)
    .parse('delete Patient 1234');
});

test.serial.cb('The "fhir-search-delete" command should delete all fhir resource of a certain type matching a query and dataset', t => {
  yargs.command(searchDel)
    .parse('search-delete Patient project-id --query name=John');

  t.is(delStub.callCount, 1);
  t.is(delStub.getCall(0).args[1], 'account/dstu3/Patient?name=John&_tag=http%3A%2F%2Flifeomic.com%2Ffhir%2Fdataset%7Cproject-id');
  t.is(printSpy.callCount, 0);
  t.end();
});

test.serial.cb('The "fhir-get" command should get a fhir resource', t => {
  const res = { data: { resourceType: 'Patient', id: '1234' } };
  getStub.onFirstCall().returns(res);

  callback = () => {
    t.is(getStub.callCount, 1);
    t.truthy(getStub.getCall(0).args[0]);
    t.is(getStub.getCall(0).args[1], '/account/dstu3/Patient/1234');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { id: '1234', resourceType: 'Patient' });
    t.end();
  };

  yargs.command(get)
    .parse('get Patient 1234');
});

test.serial.cb('The "fhir me" command should get a users\'s patient records', t => {
  const res = { data: { entry: [{ 'resource': { 'resourceType': 'Patient', 'id': 'ABC1234' } }] } };
  getStub.onFirstCall().returns(res);

  callback = () => {
    t.is(getStub.callCount, 1);
    t.truthy(getStub.getCall(0).args[0]);
    t.is(getStub.getCall(0).args[1], '/account/dstu3/$me');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(me)
    .parse('me');
});

test.serial.cb('The "fhir-sql" command should get fhir resources', t => {
  const res = {
    data: {
      hits: {
        hits: [
          {
            _source: {
              id: '1234',
              account: 'account',
              resourceType: 'Patient'
            }
          }
        ]
      }
    }
  };

  postStub.onFirstCall().returns(res);

  const project = '9ce94182-f9b6-4043-99c7-420c77c965aa';
  const statement = 'SELECT * FROM patient';
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], `/v1/fhir-search/projects/${project}/`);
    t.is(postStub.getCall(0).args[2], statement);
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [{ id: '1234', resourceType: 'Patient' }]);
    t.end();
  };

  yargs.command(sql).parse(`sql "${statement}" --project ${project}`);
});
