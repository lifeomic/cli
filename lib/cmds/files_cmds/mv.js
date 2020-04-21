'use strict';

const chalk = require('chalk');
const querystring = require('querystring');
const { patch, list } = require('../../api');

exports.command = 'mv <source> <dest>';
exports.desc = 'Move/rename files from <source> to <dest> within a project';
exports.builder = yargs => {
  yargs.positional('source', {
    describe: 'Either the ID of the file to move or a project ID and prefix of the form <project ID>/<prefix> to move a set of files in a project.',
    type: 'string'
  }).positional('dest', {
    describe: 'The new destination for the file within the project.',
    type: 'string'
  }).option('recursive', {
    describe:
      'If <source> is a project Id with an optional prefix, move all files under that prefix to the destination.',
    alias: 'r',
    type: 'boolean',
    default: false
  }).option('limit', {
    describe: 'The maximum number of files to move when used with the --recursive option',
    alias: 'l',
    type: 'number',
    default: 1000
  });
};

exports.handler = async argv => {
  if (argv.recursive) {
    const [datasetId, ...prefix] = argv.source.split('/');
    const normPrefix = prefix && prefix.join('/');

    const opts = {
      datasetId,
      pageSize: argv.limit
    };

    if (normPrefix) {
      opts.name = normPrefix;
    }

    const response = await list(argv, `/v1/files?${querystring.stringify(opts)}`);
    for (const item of response.data.items) {
      const newName = [argv.dest, item.name.replace(normPrefix, '')].join('/').replace(/\/{1,}/g, '/');
      await patch(argv, `/v1/files/${item.id}`, {
        name: newName
      });
      console.log(chalk.green(`Moved: `) + item.name + chalk.green(` to `) + newName);
    }
  } else {
    await patch(argv, `/v1/files/${argv.source}`, {
      name: argv.dest
    });
    console.log(chalk.green(`Moved: `) + argv.source + chalk.green(` to `) + argv.dest);
  }
};
