'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const axiosStub = sinon.stub().resolves();
axiosStub.create = () => axiosStub;
axiosStub.get = sinon.stub();
axiosStub.delete = sinon.stub().resolves();

process.env.PART_BYTES_SIZE = 3;
const MAX_PART_UPLOAD_ATTEMPTS = process.env.MAX_PART_UPLOAD_ATTEMPTS = 3;

const api = proxyquire(
  '../../lib/api',
  {
    'cli-progress': {
      Bar: class Bar {
        start () {}
        increment () {}
        stop () {}
      }
    },
    './interceptor/tokenProvider': requestConfig => requestConfig,
    './config': {
      getEnvironment () { return 'test'; },
      get () { return 'dummy'; }
    },
    'axios': axiosStub,
    'axios-retry': sinon.spy()
  });

test.afterEach(() => {
  axiosStub.reset();
  axiosStub.get.reset();
  axiosStub.delete.reset();
});

test.serial('multipartUpload should upload a file in chunks', async t => {
  axiosStub.get.onCall(0).resolves({ data: { uploadUrl: '/part-upload-url/1' } });
  axiosStub.get.onCall(1).resolves({ data: { uploadUrl: '/part-upload-url/2' } });
  axiosStub.get.onCall(2).resolves({ data: { uploadUrl: '/part-upload-url/3' } });

  await api.multipartUpload({ parallel: 1 }, 'uploadId', `${__dirname}/commands/data/file1.txt`, 7);
  t.is(axiosStub.get.callCount, 3); // 7 bytes in 3-byte chunks
  t.is(axiosStub.callCount, 3);
  t.is(axiosStub.delete.callCount, 1);

  for (let i = 0; i < 3; i++) {
    t.true(axiosStub.get.getCall(i).args[0].startsWith(`/v1/uploads/uploadId/parts/${i + 1}`));
    t.true(axiosStub.getCall(i).args[0].url.startsWith(`/part-upload-url/${i + 1}`));
  }
});

test.serial('multipartUpload should retry 400 errors MAX_PART_UPLOAD_ATTEMPTS times, then fail', async t => {
  axiosStub.get.resolves({ data: { uploadUrl: '/part-upload-url' } });
  axiosStub.rejects({ response: { status: 400 } });

  await t.throws(api.multipartUpload({ parallel: 1 }, 'uploadId', `${__dirname}/commands/data/file1.txt`, 7));

  t.is(axiosStub.get.callCount, MAX_PART_UPLOAD_ATTEMPTS);
});
