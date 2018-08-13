'use strict';

const sinon = require('sinon');
const test = require('ava');
const yargs = require('yargs');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();

let callback = null;
const mocks = {
  '../../api': {
    get: getStub,
    post: postStub,
    del: delStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const create = proxyquire('../../../lib/cmds/api_keys_cmds/create', mocks);
const del = proxyquire('../../../lib/cmds/api_keys_cmds/del', mocks);
const list = proxyquire('../../../lib/cmds/api_keys_cmds/list', mocks);

test.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
});

test.cb('The "api-keys list" command should list api-keys for an account', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/api-keys?pageSize=25&nextPageToken=');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list');
});

test.cb('The "api-keys list" command should list api-keys for an account with optional args', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/api-keys?pageSize=30&nextPageToken=token');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list --page-size 30 --next-page-token token');
});

test.cb('The "api-keys delete" should delete an API key', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/v1/api-keys/apiKeyId');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], {id: 'apiKeyId'});
    t.end();
  };

  yargs.command(del)
    .parse('delete apiKeyId');
});

test.cb('The "api-keys create" should create an API key', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/api-keys');
    t.deepEqual(postStub.getCall(0).args[2], { name: 'mykey', expireInDays: 23 });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(create)
    .parse('create mykey --expire-in-days 23');
});
