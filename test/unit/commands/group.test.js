'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const putStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const mocks = {
  '../../api': {
    get: getStub,
    post: postStub,
    del: delStub,
    put: putStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const get = proxyquire('../../../lib/cmds/groups_cmds/get', mocks);
const list = proxyquire('../../../lib/cmds/groups_cmds/list', mocks);
const create = proxyquire('../../../lib/cmds/groups_cmds/create', mocks);
const update = proxyquire('../../../lib/cmds/groups_cmds/update', mocks);
const membersAdd = proxyquire('../../../lib/cmds/groups_cmds/members-add', mocks);
const membersRemove = proxyquire('../../../lib/cmds/groups_cmds/members-remove', mocks);
const members = proxyquire('../../../lib/cmds/groups_cmds/members', mocks);

test.afterEach.always(t => {
  getStub.reset();
  postStub.reset();
  delStub.reset();
  putStub.reset();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "groups" command should list groups for an account', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/account/groups?pageSize=25');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list');
});

test.serial.cb('The "groups" command should list groups for an account with optional args', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/account/groups?pageSize=30&nextPageToken=token&name=name');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(list)
    .parse('list --page-size 30 --prefix name --next-page-token token');
});

test.serial.cb('The "groups-get" command should get a group', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/account/groups/groupid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(get)
    .parse('get groupid');
});

test.serial.cb('The "groups-create" command should create a groups', t => {
  const res = { data: {} };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/account/groups');
    t.deepEqual(postStub.getCall(0).args[2], { name: 'groupname', description: undefined });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(create)
    .parse('create groupname');
});

test.serial.cb('The "groups-update" command should update a groups', t => {
  const res = { data: {} };
  putStub.onFirstCall().returns(res);
  callback = () => {
    t.is(putStub.callCount, 1);
    t.is(putStub.getCall(0).args[1], '/v1/account/groups/groupid');
    t.deepEqual(putStub.getCall(0).args[2], { id: 'groupid', name: 'groupname', description: 'groupdesc' });
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(update)
    .parse('update groupid groupname -d groupdesc');
});

test.serial.cb('The "groups-members" command should list members for a group', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/account/groups/groupid/members?pageSize=25');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  yargs.command(members)
    .parse('members groupid');
});

test.serial.cb('The "groups-members-remove" command should remove a user', t => {
  const res = { data: { } };
  delStub.onFirstCall().returns(res);
  callback = () => {
    t.is(delStub.callCount, 1);
    t.is(delStub.getCall(0).args[1], '/v1/account/groups/groupid/members/userid');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { id: 'userid' });
    t.end();
  };

  yargs.command(membersRemove)
    .parse('members-remove groupid userid');
});

test.serial.cb('The "groups-members-add" command should add a user', t => {
  const res = { data: { } };
  putStub.onFirstCall().returns(res);
  callback = () => {
    t.is(putStub.callCount, 1);
    t.is(putStub.getCall(0).args[1], '/v1/account/groups/groupid/members/userid');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { id: 'userid' });
    t.end();
  };

  yargs.command(membersAdd)
    .parse('members-add groupid userid');
});
