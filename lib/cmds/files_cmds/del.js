'use strict';

const chalk = require('chalk');
const { del } = require('../../api');

exports.command = 'delete <fileId>';
exports.desc = 'Delete a file by <fileId>';
exports.builder = yargs => {
  yargs.positional('fileId', {
    describe: 'The ID of the file to delete.',
    type: 'string'
  });
};

exports.handler = async argv => {
  await del(argv, `/v1/files/${argv.fileId}`);
  console.log(chalk.green(`Deleted file: ${argv.fileId}`));
};
