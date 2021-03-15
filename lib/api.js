'use strict';

const axios = require('axios');
const axiosRetry = require('axios-retry');
const { isNetworkOrIdempotentRequestError, isNetworkError, isRetryableError } = require('axios-retry');
const chalk = require('chalk');
const { Bar } = require('cli-progress');
const fs = require('fs');
const config = require('./config');
const mkdirp = require('mkdirp');
const { name, version } = require('../package.json');
const queue = require('queue');
const { dirname } = require('path');
const tokenProvider = require('./interceptor/tokenProvider');
const debug = require('debug')('lo:api');
const FileVerificationStream = require('./FileVerificationStream');

axiosRetry(axios, {
  retries: 3
});
axios.defaults.headers.common['User-Agent'] = `${name}/${version}`;

const PART_BYTES_SIZE = process.env.PART_BYTES_SIZE || 5 * 1024 * 1024;
const MAX_PARTS = 10000;

function request (options, condition = isNetworkOrIdempotentRequestError) {
  const environment = config.getEnvironment();

  const account = options.account || config.get(`${environment}.defaults.account`);
  if (!account) {
    throw new Error(`Account needs to be set with 'lo defaults' or specified with the -a option.`);
  }

  const client = axios.create({
    baseURL: config.get(`${environment}.apiUrl`),
    headers: {
      'LifeOmic-Account': account,
      'Content-Type': options.ContentType || 'application/json'
    }
  });
  client.interceptors.request.use(tokenProvider);
  axiosRetry(client, { retries: 3, retryCondition: condition });
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

module.exports.MULTIPART_MIN_SIZE = PART_BYTES_SIZE;

module.exports.get = function (options, path) {
  return request(options).get(path);
};

module.exports.del = function (options, path) {
  return request(options).delete(path);
};

module.exports.patch = function (options, path, body) {
  // PATCH is not in `axios-retry.IDEMPOTENT_HTTP_METHODS`
  const condition = (error) => isNetworkError(error) || isRetryableError(error);
  return request(options, condition).patch(path, body);
};

module.exports.post = function (options, path, body) {
  return request(options).post(path, body);
};

module.exports.put = function (options, path, body) {
  return request(options).put(path, body);
};

module.exports.list = async function (options, path) {
  const result = {
    data: {
      items: []
    }
  };
  let url = path;

  do {
    const response = await module.exports.get(options, url);
    for (const item of response.data.items) {
      result.data.items.push(item);
    }

    if (response.data.links && response.data.links.next) {
      url = response.data.links.next;
    } else {
      url = null;
    }
  } while (url && result.data.items.length < options.limit);

  return result;
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

module.exports.getFileVerificationStream = async function (filePath, fileSize) {
  const bar = progress(filePath);
  bar.start(fileSize, 0);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const stream = fs.createReadStream(filePath)
    .on('data', e => {
      bar.increment(e.length);
    })
    .on('end', () => {
      bar.stop();
    });

  const verifyStream = new FileVerificationStream();
  stream.pipe(verifyStream);

  await verifyStream.loadData();
  return verifyStream;
};

module.exports.upload = async function (uploadUrl, fileSize, data, contentMD5) {
  const headers = {
    'Content-Length': fileSize
  };

  if (contentMD5) {
    headers['Content-MD5'] = contentMD5;
  }

  await axios({
    method: 'put',
    url: uploadUrl,
    data,
    headers,
    'axios-retry': {
      retryCondition: err =>
        (axiosRetry.isNetworkOrIdempotentRequestError(err) ||
          (err.response.status >= 400 && err.response.status < 500))
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

const MAX_PART_UPLOAD_ATTEMPTS = process.env.MAX_PART_UPLOAD_ATTEMPTS || 10;

module.exports.multipartUpload = async function (options, uploadId, fileName, fileSize, urlPrefix = '/v1/uploads') {
  const bar = progress(fileName);
  bar.start(fileSize, 0);
  const q = queue({
    concurrency: options.parallel || 4
  });

  let partSize = Math.ceil(fileSize / MAX_PARTS);
  partSize = Math.max(partSize, PART_BYTES_SIZE);
  const totalParts = Math.ceil(fileSize / partSize);
  debug(`Uploading ${totalParts} parts of size ${partSize}`);

  for (let part = 1; part <= totalParts; ++part) {
    q.push(async () => {
      const start = (part - 1) * (partSize);
      const end = part === totalParts ? fileSize - 1 : start + partSize - 1;
      const size = end - start + 1;
      let attempts = 0;

      do {
        debug(`Starting part ${part}, size: ${size}`);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const stream = fs.createReadStream(fileName, {
          start: start,
          end: end
        });

        const verifyStream = new FileVerificationStream();
        stream.pipe(verifyStream);

        await verifyStream.loadData();
        const contentMD5 = encodeURIComponent(verifyStream.contentMD5);
        debug(`Calculated MD5 for ${part}, size: ${size}`);

        const response = await request(options).get(`${urlPrefix}/${uploadId}/parts/${part}?contentMD5=${contentMD5}`);

        try {
          debug(`Uploading part ${part}, size: ${size}`);
          const time = process.hrtime();
          await axios({
            method: 'put',
            url: response.data.uploadUrl,
            data: verifyStream.data,
            headers: {
              'Content-Length': size,
              'Content-MD5': verifyStream.contentMD5
            },
            maxContentLength: size
          });
          const diff = process.hrtime(time);
          bar.increment(size);
          debug(`Completed part ${part}, size: ${size} in ${diff[0]}s ${diff[1] / 1000000}ms`);
          return;
        } catch (err) {
          // S3 will respond with a 400 for a socket timeout which could occur from a slow stream read.
          // Retry these errors up to 10 times to get the part uploaded.
          if (++attempts < MAX_PART_UPLOAD_ATTEMPTS && err.response && (err.response.status === 400 || err.response.status === 403)) {
            debug({ attempts, part }, `Retrying ${err.response.status} status code: ${err.response.data}`);
          } else {
            throw err;
          }
        }
      } while (attempts < MAX_PART_UPLOAD_ATTEMPTS);
    });
  }

  try {
    await startQueue(q);
  } catch (err) {
    throw err;
  } finally {
    bar.stop();
  }

  await request(options).delete(`${urlPrefix}/${uploadId}`);
};
