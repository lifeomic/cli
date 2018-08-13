'use strict';

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const recursive = require('recursive-readdir');
const {
  upload,
  get,
  multipartUpload,
  post,
  MULTIPART_MIN_SIZE
} = require('../../api');
const _get = require('lodash/get');
const sleep = require('../../sleep');

const FILES_URL = '/v1/files';
const UPLOADS_URL = '/v1/uploads';
const VERIFICATION_RETRIES = 5;

exports.command = 'upload <file> <datasetId>';
exports.desc = 'Upload a local file or directory of files to a project.';
exports.builder = yargs => {
  yargs
    .positional('file', {
      describe: 'The file or directory to upload',
      type: 'string'
    })
    .positional('datasetId', {
      describe: 'The dataset ID for the uploaded file.',
      type: 'string'
    })
    .option('parallel', {
      describe:
        'For multipart uploads, the maximum number of concurrent uploads to do at one time.',
      type: 'number',
      alias: 'p',
      default: 4
    })
    .option('recursive', {
      describe:
        'If <file> is a directory, uploads all files in the directory and any sub directories.',
      alias: 'r',
      type: 'boolean',
      default: false
    })
    .option('force', {
      describe: 'Overwrite any existing files in the dataset.',
      alias: 'f',
      type: 'boolean',
      default: false
    }).option('id', {
      describe: 'Client supplied id. Must be a valid v4 UUID.',
      type: 'string'
    }).option('delete-after-upload', {
      describe: 'Delete each file after it is successfully uploaded.',
      type: 'boolean',
      default: false
    });
};

exports.handler = async argv => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!fs.existsSync(argv.file)) {
    throw new Error(`${argv.file} does not exist`);
  }

  let files = [];

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (fs.lstatSync(argv.file).isDirectory()) {
    if (argv.recursive) {
      files = await recursive(argv.file);
    } else {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      files = fs
        .readdirSync(argv.file)
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        .filter(f => fs.lstatSync(path.join(argv.file, f)).isFile())
        .map(f => path.join(argv.file, f));
    }
  } else {
    files = [argv.file];
  }

  for (const file of files) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    let stats = fs.statSync(file);
    const fileSize = stats['size'];
    const fileName = file.startsWith('./') ? file.slice(2) : file;

    try {
      if (fileSize > MULTIPART_MIN_SIZE) {
        const response = await post(argv, UPLOADS_URL, {
          id: argv.id,
          name: fileName,
          datasetId: argv.datasetId,
          overwrite: argv.overwrite
        });

        await multipartUpload(argv, response.data.uploadId, file, fileSize);
        console.log(
          chalk.green(`Upload complete: ${fileName}, ID: ${response.data.id}`)
        );
      } else {
        const response = await post(argv, FILES_URL, {
          id: argv.id,
          name: fileName,
          datasetId: argv.datasetId,
          overwrite: argv.overwrite
        });

        await upload(response.data.uploadUrl, file, fileSize);
        console.log(
          chalk.green(`Upload complete: ${fileName}, ID: ${response.data.id}`)
        );
      }
    } catch (error) {
      if (
        _get(error, 'response.data.error', '').indexOf('already exists') > -1
      ) {
        console.log(
          chalk.yellow(`Ignoring already uploaded file: ${fileName}`)
        );
      } else {
        throw error;
      }
    }

    if (argv.deleteAfterUpload) {
      let verified = false;
      for (let i = 1; i <= VERIFICATION_RETRIES; i++) {
        await sleep(i * 500);

        const searchOptions = {
          datasetId: argv.datasetId,
          name: fileName,
          pageSize: 1
        };
        const searchResponse = await get(
          argv,
          `${FILES_URL}?${querystring.stringify(searchOptions)}`
        );
        const result = _get(searchResponse, 'data.items[0]');
        if (result) {
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          stats = fs.statSync(file);
          if (stats.size !== result.size) {
            throw new Error(`Detected file size mismatch for ${fileName}. Use --overwrite if the file should be replaced.
                Uploaded file size: ${result.size}
                Local file size: ${stats.size}`);
          }
          verified = true;
          break;
        }
        console.log(
          chalk.yellow(`${fileName} could not yet be verified - retry ${i}`)
        );
      }
      if (!verified) {
        throw new Error(`Could not verify uploaded file: ${fileName}`);
      }

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.unlinkSync(file);
    }
  }
};
