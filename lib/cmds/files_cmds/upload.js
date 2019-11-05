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
  getFileVerificationStream,
  MULTIPART_MIN_SIZE
} = require('../../api');
const _get = require('lodash/get');
const sleep = require('../../sleep');
const mkdirp = require('mkdirp');

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
    }).option('move-after-upload', {
      describe: 'Move each file after it is successfully uploaded. The value needs to be the directory to which files should be moved.',
      type: 'string'
    }).option('ignore', {
      describe: 'For recursive uploads, ignore errors and continue uploading files.',
      alias: 'i',
      type: 'boolean',
      default: false
    }).option('remote-path', {
      describe: 'Path to store this file on the PHC files for this dataset.',
      type: 'string'
    }).option('strip-path', {
      describe: 'Strip local path from remote file path. This allows you to reference local a local path but removes it in the upload path.',
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
    const fileName = (file.startsWith('./') ? file.slice(2) : file).replace(/\\/g, '/');
    const fileOnlyName = argv.stripPath ? fileName.substring(argv.file.length + 1) : fileName;
    const remoteFileName = argv.remotePath && argv.remotePath.length > 0 ? argv.remotePath + '/' + fileOnlyName : fileOnlyName;

    try {
      if (fileSize > MULTIPART_MIN_SIZE) {
        const response = await post(argv, UPLOADS_URL, {
          id: argv.id,
          name: remoteFileName,
          datasetId: argv.datasetId,
          overwrite: argv.overwrite || argv.force
        });

        await multipartUpload(argv, response.data.uploadId, file, fileSize);
        console.log(
          chalk.green(`Upload complete: ${fileName}, ID: ${response.data.id}`)
        );
      } else {
        const verifyStream = await getFileVerificationStream(file, fileSize);
        const body = {
          id: argv.id,
          name: remoteFileName,
          datasetId: argv.datasetId,
          overwrite: argv.overwrite || argv.force
        };

        if (verifyStream.contentMD5) {
          body.contentMD5 = verifyStream.contentMD5;
        }

        const response = await post(argv, FILES_URL, body);

        await upload(response.data.uploadUrl, fileSize, verifyStream.data, verifyStream.contentMD5);
        console.log(
          chalk.green(`Upload complete: ${fileName}, ID: ${response.data.id}`)
        );
      }
    } catch (error) {
      if (_get(error, 'response.data.error', '').indexOf('already exists') > -1) {
        console.log(
          chalk.yellow(`Ignoring already uploaded file: ${fileName}`)
        );
      } else {
        if (argv.ignore) {
          console.error(error, chalk.red(`Failed to upload ${fileName}.  Continuing...`));
        } else {
          throw error;
        }
      }
    }

    if (argv.deleteAfterUpload || argv.moveAfterUpload) {
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
            throw new Error(`Detected file size mismatch for ${fileName}. Use --force if the file should be replaced.
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

      if (argv.moveAfterUpload) {
        const destination = path.join(argv.moveAfterUpload, fileName);
        const directory = path.dirname(destination);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (!fs.existsSync(directory)) {
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          mkdirp.sync(directory);
        }
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.copyFileSync(file, destination);
      }

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.unlinkSync(file);
    }
  }
};
