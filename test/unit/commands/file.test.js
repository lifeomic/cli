'use strict';

const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
const downloadSpy = sinon.spy();
const uploadSpy = sinon.spy();
let callback;

const program = proxyquire('../../../lib/commands/file', {
  '../api': {
    get: getStub,
    post: postStub,
    del: delStub,
    download: function (options, url, file, name) {
      downloadSpy(options, url, file, name);
      callback();
    },
    upload: function (url, file, size) {
      uploadSpy(url, file, size);
      callback();
    }
  },
  '../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
});

test.afterEach.always(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  uploadSpy.resetHistory();
  downloadSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "files" command should list files for an account or dataset ID', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/files?pageSize=25&nextPageToken=&orderBy=name');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  program.parse(['node', 'lo', 'files']);
});

test.serial.cb('The "files" command should list files for an account with optional args', t => {
  const res = { data: { items: [] } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/files?pageSize=30&nextPageToken=token&orderBy=name&datasetId=dataset&name=name');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], { items: [] });
    t.end();
  };

  program.parse(['node', 'lo', 'files', 'dataset', '--page-size', '30', '--prefix', 'name', '--next-page-token', 'token']);
});

test.serial.cb('The "files-get" should get a file', t => {
  const res = { data: {} };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/files/fileid');
    t.is(printSpy.callCount, 1);
    t.is(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  program.parse(['node', 'lo', 'files-get', 'fileid']);
});

test.serial.cb('The "files-delete" should delete a file', t => {
  const res = { data: {} };
  delStub.onFirstCall().returns(res);
  program.parse(['node', 'lo', 'files-delete', 'fileid']);

  t.is(delStub.callCount, 1);
  t.is(delStub.getCall(0).args[1], '/v1/files/fileid');
  t.end();
});

test.serial.cb('The "files-download" should download a file', t => {
  const res = { data: { name: 'filename' } };
  getStub.onFirstCall().returns(res);
  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(getStub.getCall(0).args[1], '/v1/files/fileid');
    t.is(downloadSpy.callCount, 1);
    t.is(downloadSpy.getCall(0).args[1], '/v1/files/fileid?include=downloadUrl');
    t.is(downloadSpy.getCall(0).args[2], '/dir/filename');
    t.end();
  };

  program.parse(['node', 'lo', 'files-download', 'fileid', '/dir']);
});

test.serial.cb('The "files-upload" should upload a file', t => {
  const res = { data: { uploadUrl: 'https://host/upload' } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/files');
    t.deepEqual(postStub.getCall(0).args[2], {
      name: `${__dirname}/data/file1.txt`,
      datasetId: 'dataset',
      overwrite: undefined
    });
    t.is(uploadSpy.getCall(0).args[0], 'https://host/upload');
    t.is(uploadSpy.getCall(0).args[1], `${__dirname}/data/file1.txt`);
    t.is(uploadSpy.getCall(0).args[2], 7);
    t.end();
  };

  program.parse(['node', 'lo', 'files-upload', `${__dirname}/data/file1.txt`, 'dataset']);
});

test.serial.cb('The "files-upload" should upload a directory of files', t => {
  const res = { data: { uploadUrl: 'https://host/upload' } };
  postStub.onFirstCall().returns(res);
  postStub.onSecondCall().returns(res);

  callback = () => {
    if (postStub.callCount !== 2) {
      return;
    }
    t.is(postStub.callCount, 2);
    t.deepEqual(postStub.getCall(0).args[2], {
      name: `${__dirname}/data/file1.txt`,
      datasetId: 'dataset',
      overwrite: undefined
    });
    t.deepEqual(postStub.getCall(1).args[2], {
      name: `${__dirname}/data/file2.txt`,
      datasetId: 'dataset',
      overwrite: undefined
    });

    t.is(uploadSpy.getCall(0).args[0], 'https://host/upload');
    t.is(uploadSpy.getCall(0).args[1], `${__dirname}/data/file1.txt`);
    t.is(uploadSpy.getCall(0).args[2], 7);

    t.is(uploadSpy.getCall(1).args[0], 'https://host/upload');
    t.is(uploadSpy.getCall(1).args[1], `${__dirname}/data/file2.txt`);
    t.is(uploadSpy.getCall(1).args[2], 7);
    t.end();
  };

  program.parse(['node', 'lo', 'files-upload', `${__dirname}/data`, 'dataset']);
});

test.serial.cb('The "files-upload" should recursively upload a directory of files', t => {
  const res = { data: { uploadUrl: 'https://host/upload' } };
  postStub.onFirstCall().returns(res);
  postStub.onSecondCall().returns(res);
  postStub.onThirdCall().returns(res);

  callback = () => {
    if (postStub.callCount !== 3) {
      return;
    }
    t.is(postStub.callCount, 3);
    postStub.calledWith(sinon.match.any, sinon.match.any, sinon.match({
      name: `${__dirname}/data/file1.txt`,
      datasetId: 'dataset',
      overwrite: undefined
    }));
    postStub.calledWith(sinon.match.any, sinon.match.any, sinon.match({
      name: `${__dirname}/data/file2.txt`,
      datasetId: 'dataset',
      overwrite: undefined
    }));
    postStub.calledWith(sinon.match.any, sinon.match.any, sinon.match({
      name: `${__dirname}/data/dir/file3.txt`,
      datasetId: 'dataset',
      overwrite: undefined
    }));

    t.is(uploadSpy.getCall(0).args[0], 'https://host/upload');
    t.is(uploadSpy.getCall(0).args[1], `${__dirname}/data/file1.txt`);
    t.is(uploadSpy.getCall(0).args[2], 7);

    t.is(uploadSpy.getCall(1).args[0], 'https://host/upload');
    t.is(uploadSpy.getCall(1).args[1], `${__dirname}/data/file2.txt`);
    t.is(uploadSpy.getCall(1).args[2], 7);

    t.is(uploadSpy.getCall(2).args[0], 'https://host/upload');
    t.is(uploadSpy.getCall(2).args[1], `${__dirname}/data/dir/file3.txt`);
    t.is(uploadSpy.getCall(2).args[2], 7);
    t.end();
  };

  program.parse(['node', 'lo', 'files-upload', `${__dirname}/data`, 'dataset', '--recursive']);
});
