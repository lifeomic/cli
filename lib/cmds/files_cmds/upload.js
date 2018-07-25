'use strict';

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');
const { upload, multipartUpload, post, MULTIPART_MIN_SIZE } = require('../../api');

exports.command = 'upload <file> <datasetId>';
exports.desc = 'Download file content by <fileId>';
exports.builder = yargs => {
  yargs.positional('file', {
    describe: 'The file or directory to upload',
    type: 'string'
  }).positional('datasetId', {
    describe: 'The dataset ID for the uploaded file.',
    type: 'string'
  }).option('parallel', {
    describe: 'For multipart uploads, the maximum number of concurrent uploads to do at one time.',
    type: 'number',
    alias: 'p',
    default: 4
  }).option('recursive', {
    describe: 'If <file> is a directory, uploads all files in the directory and any sub directories.',
    alias: 'r',
    default: false
  }).option('force', {
    describe: 'Overwrite any existing files in the dataset.',
    alias: 'f',
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
      files = fs.readdirSync(argv.file)
      // eslint-disable-next-line security/detect-non-literal-fs-filename
        .filter(f => fs.lstatSync(path.join(argv.file, f)).isFile())
        .map(f => path.join(argv.file, f));
    }
  } else {
    files = [argv.file];
  }

  for (const file of files) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stats = fs.statSync(file);
    const fileSize = stats['size'];
    const fileName = file.startsWith('./') ? file.slice(2) : file;

    if (fileSize > MULTIPART_MIN_SIZE) {
      const response = await post(argv, '/v1/uploads', {
        name: fileName,
        datasetId: argv.datasetId,
        overwrite: argv.force
      });

      await multipartUpload(argv, response.data.uploadId, file, fileSize);
      console.log(chalk.green(`Upload complete: ${fileName}, ID: ${response.data.id}`));
    } else {
      const response = await post(argv, '/v1/uploads', {
        name: fileName,
        datasetId: argv.datasetId,
        overwrite: argv.force
      });

      await upload(response.data.uploadUrl, file, fileSize);
      console.log(chalk.green(`Upload complete: ${fileName}, ID: ${response.data.id}`));
    }
  }
};
