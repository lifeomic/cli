'use strict';

const axios = require('axios');
const axiosRetry = require('axios-retry');
const chalk = require('chalk');
const { Bar } = require('cli-progress');
const fs = require('fs');
const config = require('./config');
const mkdirp = require('mkdirp');
const { name, version } = require('../package.json');
const queue = require('queue');
const { dirname } = require('path');
const tokenProvider = require('./interceptor/tokenProvider');

axiosRetry(axios, { retries: 3 });
axios.defaults.headers.common['User-Agent'] = `${name}/${version}`;

const FIVE_MB = 5 * 1024 * 1024;
const MAX_PARTS = 10000;

function request (options) {
  const environment = config.getEnvironment();

  const account = options.account || config.get(`${environment}.defaults.account`);
  if (!account) {
    throw new Error(`Account needs to be set with 'lo defaults' or specified with the -a option.`);
  }

  const client = axios.create({
    baseURL: config.get(`${environment}.apiUrl`),
    headers: {
      'LifeOmic-Account': account
    }
  });
  client.interceptors.request.use(tokenProvider);
  axiosRetry(client, { retries: 3 });
  return client;
}

function progress (name) {
  return new Bar({
    format: `${name} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes`,
    hideCursor: true,
    clearOnComplete: true,
    barsize: 30
  });
}

module.exports.MULTIPART_MIN_SIZE = FIVE_MB;

module.exports.get = function (options, path) {
  return request(options).get(path);
};

module.exports.del = function (options, path) {
  return request(options).delete(path);
};

module.exports.post = function (options, path, body) {
  return request(options).post(path, body);
};

module.exports.put = function (options, path, body) {
  return request(options).put(path, body);
};

module.exports.download = async function (options, path, fileName) {
  mkdirp(dirname(fileName));

  const response = await request(options).get(path);

  const bar = progress(fileName);

  const res = await axios({
    method: 'get',
    url: response.data.downloadUrl,
    responseType: 'stream'
  });

  bar.start(res.headers['content-length'], 0);
  res.data
    .on('data', e => {
      bar.increment(e.length);
    })
    .on('end', () => {
      bar.stop();
      console.log(chalk.green(`Downloaded: ${fileName}`));
    })
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    .pipe(fs.createWriteStream(fileName));
};

module.exports.upload = async function (uploadUrl, fileName, fileSize) {
  const bar = progress(fileName);
  bar.start(fileSize, 0);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const stream = fs.createReadStream(fileName)
    .on('data', e => {
      bar.increment(e.length);
    })
    .on('end', () => {
      bar.stop();
    });

  await axios({
    method: 'put',
    url: uploadUrl,
    data: stream,
    headers: {
      'Content-Length': fileSize
    }
  });
};

function startQueue (q) {
  return new Promise((resolve, reject) => {
    q.start(error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports.multipartUpload = async function (options, uploadId, fileName, fileSize) {
  const bar = progress(fileName);
  bar.start(fileSize, 0);
  const q = queue({
    concurrency: options.parallel || 4
  });

  let partSize = Math.ceil(fileSize / MAX_PARTS);
  partSize = Math.max(partSize, FIVE_MB);
  const totalParts = Math.ceil(fileSize / partSize);

  for (let part = 1; part <= totalParts; ++part) {
    q.push(async () => {
      const start = (part - 1) * (partSize);
      const end = part === totalParts ? fileSize - 1 : start + partSize - 1;
      const size = end - start + 1;
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const stream = fs.createReadStream(fileName, {
        start: start,
        end: end
      });

      const response = await request(options).get(`/v1/uploads/${uploadId}/parts/${part}`);

      await axios({
        method: 'put',
        url: response.data.uploadUrl,
        data: stream,
        headers: {
          'Content-Length': size
        }
      });
      bar.increment(size);
    });
  }

  await startQueue(q);

  bar.stop();
  await request(options).delete(`/v1/uploads/${uploadId}`);
};
