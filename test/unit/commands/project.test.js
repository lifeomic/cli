'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const program = proxyquire('../../../lib/commands/project', {
  '../api': {
    get: getStub,
    post: postStub,
    del: delStub
  },
  '../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

test.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.cb('The "projects" command should list projects for an account', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/projects?pageSize=25&nextPageToken=');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  program.parse(['node', 'lo', 'projects']);
});

test.cb('The "projects" command should list projects for an account with optional args', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/projects?pageSize=30&nextPageToken=token&name=name');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  program.parse(['node', 'lo', 'projects', '--page-size', '30', '--prefix', 'name', '--next-page-token', 'token']);
});

test.cb('The "projects-get" should get a project', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/projects/projectid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'projects-get', 'projectid']);
});

test.cb('The "projects-delete" should delete a project', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/v1/projects/projectid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'projects-delete', 'projectid']);
});

test.cb('The "projects-create" should create a project', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/projects');
    t.deepEqual(postStub.getCall(0).args[2], { name: 'projectname' });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'projects-create', 'projectname']);
});
