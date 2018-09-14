'use strict';

const { post } = require('../../api');
const print = require('../../print');

exports.command = 'create-nantomics-vcf-import <datasetId>';
exports.desc = 'Create a task to ingest a Nantomics VCF';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('nantomics-vcf-file', {
    describe: 'The ID of the uploaded Nantomics VCF',
    alias: 'v',
    type: 'string',
    demandOption: true
  }).option('vcf-file-name', {
    describe: 'The name to use when saving the converted VCF',
    alias: 'n',
    type: 'string',
    demandOption: true
  }).option('rgel-file-name', {
    describe: 'The name to use when saving the converted RGEL file',
    alias: 'r',
    type: 'string',
    demandOption: true
  }).option('sequence-type', {
    describe: 'The type of sequence',
    alias: 'e',
    choices: ['germline', 'somatic'],
    type: 'string',
    demandOption: true
  }).option('subject-id', {
    describe: 'The ID of the subject to associated the report with',
    alias: 's',
    type: 'string',
    demandOption: true
  });
};

exports.handler = async argv => {
  const response = await post(argv, `/v1/tasks/system/nantomics-vcf-import`, {
    nantomicsVcfFileId: argv.nantomicsVcfFile,
    datasetId: argv.datasetId,
    vcfFileName: argv.vcfFileName,
    subjectId: argv.subjectId,
    sequenceType: argv.sequenceType,
    rgelFileName: argv.rgelFileName
  });
  print(response.data, argv);
};
