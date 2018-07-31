'use strict';

const chalk = require('chalk');
const program = require('commander');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { get, del, post, download, upload, multipartUpload, MULTIPART_MIN_SIZE } = require('../api');
const options = require('../common-options');
const print = require('../print');
const formatPage = require('../formatPage');
const recursive = require('recursive-readdir');
const _get = require('lodash/get');
const sleep = require('../sleep');

const FILES_URL = '/v1/files';
const UPLOADS_URL = '/v1/uploads';
const VERIFICATION_RETRIES = 5;

options(program, 'files [datasetID]')
  .description('List files by account or dataset')
  .option('--prefix <prefix>', 'Filter files where the name begins with a prefix')
  .option('--page-size <pageSize>', 'Number of items to return', 25)
  .option('--next-page-token <nextPageToken>', 'Next page token')
  .option('--order-by <orderBy>', 'Order by property', 'name')
  .action(async (dataset, options) => {
    const opts = {
      pageSize: options.pageSize,
      nextPageToken: options.nextPageToken,
      orderBy: options.orderBy
    };

    if (dataset) {
      opts.datasetId = dataset;
    }

    if (options.prefix) {
      opts.name = options.prefix;
    }

    const response = await get(options, `${FILES_URL}?${querystring.stringify(opts)}`);
    print(formatPage(response.data), options);
  });

options(program, 'files-get <fileID>')
  .description(`Fetch a file's metadata`)
  .action(async (file, options) => {
    const response = await get(options, `${FILES_URL}/${file}`);
    print(response.data, options);
  });

options(program, 'files-delete <fileID>')
  .description(`Delete a file`)
  .action(async (file, options) => {
    await del(options, `${FILES_URL}/${file}`);
    console.log(chalk.green(`Deleted file: ${file}`));
  });

options(program, 'files-download <fileID> [destDir]')
  .description('Downlaod a file to the current working directory or to a specified directory.')
  .action(async (file, destDir, options) => {
    const response = await get(options, `${FILES_URL}/${file}`);

    await download(options, `${FILES_URL}/${file}?include=downloadUrl`, path.join(destDir || process.cwd(), response.data.name));
  });

const filesUpload = async (file, dataset, options) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!fs.existsSync(file)) {
    throw new Error(`${file} does not exist`);
  }

  let files = [];

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (fs.lstatSync(file).isDirectory()) {
    if (options.recursive) {
      files = await recursive(file);
    } else {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      files = fs.readdirSync(file)
      // eslint-disable-next-line security/detect-non-literal-fs-filename
        .filter(f => fs.lstatSync(path.join(file, f)).isFile())
        .map(f => path.join(file, f));
    }
  } else {
    files = [file];
  }

  for (file of files) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stats = fs.statSync(file);
    const fileSize = stats['size'];
    const fileName = file.startsWith('./') ? file.slice(2) : file;

    try {
      if (fileSize > MULTIPART_MIN_SIZE) {
        const response = await post(options, UPLOADS_URL, {
          name: fileName,
          datasetId: dataset,
          overwrite: options.overwrite
        });

        await multipartUpload(options, response.data.uploadId, file, fileSize);
        console.log(chalk.green(`Upload complete: ${fileName}, ID: ${response.data.id}`));
      } else {
        const response = await post(options, FILES_URL, {
          name: fileName,
          datasetId: dataset,
          overwrite: options.overwrite
        });

        await upload(response.data.uploadUrl, file, fileSize);
        console.log(chalk.green(`Upload complete: ${fileName}, ID: ${response.data.id}`));
      }
    } catch (error) {
      if (_get(error, 'response.data.error', '').indexOf('already exists') > -1) {
        console.log(chalk.yellow(`Ignoring already uploaded file: ${fileName}`));
      } else {
        throw error;
      }
    }

    if (options.deleteAfterUpload) {
      let verified = false;
      for (let i = 1; i <= VERIFICATION_RETRIES; i++) {
        await sleep(i * 500);

        const searchOptions = {
          datasetId: dataset,
          name: fileName,
          pageSize: 1
        };
        const searchResponse = await get(options, `${FILES_URL}?${querystring.stringify(searchOptions)}`);
        const result = _get(searchResponse, 'data.items[0]');
        if (result) {
          if (stats.size !== result.size) {
            throw new Error(`Detected file size mismatch for ${fileName}. Use --overwrite if the file should be replaced.
              Uploaded file size: ${result.size}
              Local file size: ${stats.size}`);
          }
          verified = true;
          break;
        }
        console.log(chalk.yellow(`${fileName} could not yet be verified - retry ${i}`));
      }
      if (!verified) {
        throw new Error(`Could not verify uploaded file: ${fileName}`);
      }

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.unlinkSync(file);
    }
  }
};

options(program, 'files-upload <file> <datasetID>')
  .option('--parallel <parallel>', 'For multipart uploads, the maximum number of concurrent uploads to do at one time.')
  .option('--recursive', 'If <file> is a directory, uploads all files in the directory and any sub directories.')
  .option('--overwrite', 'Overwrite any existing files in the dataset.')
  .option('--delete-after-upload', 'Delete each file after it is successfully uploaded.')
  .description('Upload a local file or directory of files to a dataset.')
  .action(filesUpload);

module.exports.program = program;
module.exports.filesUpload = filesUpload;
