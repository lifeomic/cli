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

const program = proxyquire('../../../lib/commands/policy', {
  '../api': {
    get: getStub,
    post: postStub,
    del: delStub,
    put: putStub
  },
  '../print': (data, opts) => {
    printSpy(data, opts);
    callback();
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

test.serial.cb('The "policies" command should list policies for an account', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/policies?pageSize=25&nextPageToken=');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  program.parse(['node', 'lo', 'policies']);
});

test.serial.cb('The "policies" command should list groups for an account with optional args', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/policies?pageSize=30&nextPageToken=token');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  program.parse(['node', 'lo', 'policies', '--page-size', '30', '--next-page-token', 'token']);
});

test.serial.cb('The "policies-get" command should get a policy', t => {
  const res = { data: { policy: {} } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/policies/My Policy');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'policies-get', 'My Policy']);
});

test.serial.cb('The "policies-create" command should create a policy', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  const data = { name: 'My Policy' };
  readStub.onFirstCall().returns(data);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/policies');
    t.deepEqual(postStub.getCall(0).args[2], { name: 'My Policy' });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'policies-create']);
});

test.serial.cb('The "policies-update" command should update a policies', t => {
  const res = { data: { name: 'New Name' } };
  putStub.onFirstCall().returns(res);
  const data = { name: 'New Name' };
  readStub.onFirstCall().returns(data);
  callback = () => {
    t.is(putStub.callCount, 1);
    t.is(putStub.getCall(0).args[1], '/v1/policies/Old Name');
    t.deepEqual(putStub.getCall(0).args[2], { name: 'New Name' });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'policies-update', 'Old Name']);
});

test.serial.cb('The "policies-delete" command should remove a policy', t => {
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/v1/policies/My Policy');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { name: 'My Policy' });
    t.end();
  };

  program.parse(['node', 'lo', 'policies-delete', 'My Policy']);
});

test.serial.cb('The "policies-evaluate" command should evaluate the policy for the logged in user', t => {
  const res = { data: { rules: {} } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/evaluated-policy');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'policies-evaluate']);
});

test.serial.cb('The "policies-evaluate" with argument should evaluate the policy for the given user', t => {
  const res = { data: { rules: {} } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/evaluated-policy?user=user.name');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'policies-evaluate', 'user.name']);
});
