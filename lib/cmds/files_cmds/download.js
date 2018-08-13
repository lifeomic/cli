'use strict';

const path = require('path');
const { get, download } = require('../../api');

exports.command = 'download <fileId> [destDir]';
exports.desc = 'Download file content by <fileId>';
exports.builder = yargs => {
  yargs.positional('fileId', {
    describe: 'The ID of the file to download.',
    type: 'string'
  }).positional('destDir', {
    describe: 'The destination directory for the download file.  Defaults to current working directory',
    type: 'string'
  });
};

exports.handler = async argv => {
  const response = await get(argv, `/v1/files/${argv.fileId}`);

  await download(argv, `/v1/files/${argv.fileId}?include=downloadUrl`, path.join(argv.destDir || process.cwd(), response.data.name));
};
