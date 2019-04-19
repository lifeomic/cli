'use strict';

const querystring = require('querystring');
const { list } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');
const columnify = require('columnify');

exports.command = 'ls <datasetId> [folder]';
exports.desc = 'List files and folders by dataset <datasetId> and folder [folder]';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The ID of the dataset to search within.',
    type: 'string'
  }).positional('folder', {
    describe: 'Folder path to list the objects from "myfiles/pictures"',
    type: 'string'
  }).option('limit', {
    describe: 'The maximum number of items to return',
    alias: 'l',
    type: 'number'
  }).option('tabular', {
    describe: 'Print output in a table',
    type: 'boolean',
    alias: 'p',
    default: true
  });
};

exports.handler = async argv => {
  const opts = {
    pageSize: 1000
  };

  if (argv.folder) {
    opts.prefix = argv.folder;
  }

  const response = await list(argv, `/v1/projects/${argv.datasetId}/files?${querystring.stringify(opts)}`);

  if (argv.tabular) {
    console.log(`total ${response.data.items.length}`);

    const items = response.data.items.map(i => {
      if (i.type === 'FOLDER') {
        i.contentType = 'folder';
      }

      if (i.lastModified) {
        i.lastModified = new Date(i.lastModified).toLocaleString();
      }
      return i;
    });
    console.log(columnify(items, {
      showHeaders: false,
      columns: ['id', 'contentType', 'size', 'lastModified', 'name']
    }));
  } else {
    print(formatPage(response.data), argv);
  }
};
