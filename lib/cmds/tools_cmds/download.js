'use strict';

const path = require('path');
const { get, download } = require('../../api');
const print = require('../../print');

exports.command = 'download <toolId> [destDir]';
exports.desc = 'Download the tool by id <toolId>';
exports.builder = yargs => {
  yargs.positional('toolId', {
    describe: 'The ID of the tool to download.',
    type: 'string'
  }).positional('destDir', {
    describe: 'The destination directory for the download tool.  Defaults to current working directory',
    type: 'string'
  }).option('version', {
    describe: 'The version of the tool to download',
    alias: 'v',
    type: 'string'
  });
};

exports.handler = async argv => {
  const toolId = argv.toolVersion ? `${argv.toolId}:${argv.toolVersion}` : argv.toolId;
  const response = await get(argv, `/v1/trs/files/${toolId}/download`);
  await download(argv, `/v1/trs/files/${toolId}/download`, path.join(argv.destDir || process.cwd(), response.data.fileName));
  print('Download complete', argv);
};
