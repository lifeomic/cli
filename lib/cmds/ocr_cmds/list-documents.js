'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');
const formatPage = require('../../formatPage');

exports.command = 'list-documents <projectId>';
exports.desc = 'List OCR documents by project <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project to search within.',
    type: 'string'
  }).option('subjectId', {
    describe: 'Filter documents which belongs to <subjectId>',
    alias: 's',
    type: 'string'
  }).option('fileId', {
    describe: 'Filter documents which belongs to <fileId>',
    alias: 'f',
    type: 'string'
  }).option('documentReferenceId', {
    describe: 'Filter documents which belongs to <documentReferenceId>',
    alias: 'd',
    type: 'string'
  }).option('page-size', {
    describe: 'Number of items to return',
    type: 'number',
    alias: 'n',
    default: 25
  }).option('next-page-token', {
    describe: 'Next page token',
    alias: 't',
    type: 'string'
  });
};

exports.handler = async argv => {
  const opts = {
    project: argv.projectId,
    subject: argv.subjectId,
    fileId: argv.fileId,
    documentReference: argv.documentReferenceId,
    pageSize: argv.pageSize,
    nextPageToken: argv.nextPageToken
  };
  const response = await get(argv, `/v1/ocr/documents?${querystring.stringify(opts)}`);
  print(formatPage(response.data), argv);
};
