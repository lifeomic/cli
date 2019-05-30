'use strict';

const querystring = require('querystring');
const path = require('path');
const { get, download, list } = require('../../api');

exports.command = 'download <source> [destDir]';
exports.desc = 'Download file content by <source>';
exports.builder = yargs => {
  yargs.positional('source', {
    describe: 'Either the ID of the file to download or a project ID and prefix of the form <project ID>/<prefix> to download a set of files from a project.',
    type: 'string'
  }).positional('destDir', {
    describe: 'The destination directory for the download file.  Defaults to current working directory',
    type: 'string'
  }).option('recursive', {
    describe:
      'If <source> is a project Id with an optional prefix, download all files under that prefix to the destination.',
    alias: 'r',
    type: 'boolean',
    default: false
  }).option('limit', {
    describe: 'The maximum number of files to download when used with the --recursive option',
    alias: 'l',
    type: 'number',
    default: 1000
  });
};

exports.handler = async argv => {
  if (argv.recursive) {
    const [datasetId, prefix] = argv.source.split('/');

    const opts = {
      datasetId,
      pageSize: argv.limit
    };

    if (prefix) {
      opts.name = prefix;
    }

    const response = await list(argv, `/v1/files?${querystring.stringify(opts)}`);
    for (const item of response.data.items) {
      await download(argv, `/v1/files/${item.id}?include=downloadUrl`, path.join(argv.destDir || process.cwd(), item.name));
    }
  } else {
    const response = await get(argv, `/v1/files/${argv.source}`);

    await download(argv, `/v1/files/${argv.source}?include=downloadUrl`, path.join(argv.destDir || process.cwd(), response.data.name));
  }
};
