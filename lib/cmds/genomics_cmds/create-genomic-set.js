'use strict';

const { post } = require('../../ga4gh');
const print = require('../../print');
const { convertToISODateString } = require('../../dateConversion');

exports.command = 'create-genomic-set <datasetId>';
exports.desc = 'Create genomic resources by indexing a VCF and/or BAM';
exports.builder = yargs => {
  yargs.positional('datasetId', {
    describe: 'The dataset Id.',
    type: 'string'
  }).option('name', {
    describe: 'A friendly display name to use for the sequence resources',
    demandOption: true,
    alias: 'n',
    type: 'string'
  }).option('variants-file', {
    describe: 'The ID(s) of the VCF file(s) to index.  If multiple are specified they will be combined',
    alias: 'v',
    type: 'array',
    demandOption: true
  }).option('bam-file', {
    describe: 'The ID of the BAM file to index',
    alias: 'b',
    type: 'string'
  }).option('patient', {
    describe: 'The patient ID to reference',
    alias: 'p',
    type: 'string',
    demandOption: true
  }).option('reference', {
    demandOption: true,
    choices: ['GRCh37', 'GRCh38'],
    describe: 'The reference build',
    alias: 'r',
    type: 'string'
  }).option('sequence-type', {
    choices: ['germline', 'somatic', 'metastatic', 'ctDNA', 'rna'],
    describe: 'The sequence type',
    alias: 't',
    type: 'string',
    demandOption: true
  }).option('test-type', {
    describe: 'The genetic test type.',
    type: 'string'
  }).option('indexed-date', {
    describe: 'The date the genetic test was performed.',
    type: 'string'
  }).option('performer-id', {
    describe: 'The ID of the FHIR Organization resource that performed the seqeuncing.',
    type: 'string'
  }).option('output-vcf-name', {
    describe: 'The name to use for the normalized VCF.  Use the same name as the input VCF to update it.',
    type: 'string',
    alias: 'o',
    demandOption: true
  }).option('pass-filter', {
    describe: 'Update the filter for all variants to be PASS',
    type: 'boolean',
    default: false
  }).option('update-sample', {
    describe: 'Update the VCF sample name to a unique value',
    type: 'boolean',
    default: false
  }).option('test-id', {
    describe: 'The ID of the test to use for grouping related genomic sets.',
    type: 'string'
  }).option('sequence-id', {
    describe: 'The ID to use for the FHIR Sequence resource.',
    type: 'string'
  }).option('body-site', {
    describe: 'The body site of the specimen.',
    type: 'string',
    demandOption: false
  }).option('body-site-display', {
    describe: 'The display field for the body-site.',
    type: 'string',
    demandOption: false
  }).option('body-site-system', {
    describe: 'The defining system of the provided body site.',
    type: 'string',
    demandOption: false
  });
};

exports.handler = async argv => {
  const response = await post(argv, '/genomicsets', {
    datasetId: argv.datasetId,
    variantsFileIds: argv.variantsFile,
    readsFileId: argv.bamFile,
    name: argv.name,
    patientId: argv.patient,
    referenceSetId: argv.reference,
    sequenceType: argv.sequenceType,
    testType: argv.testType,
    indexedDate: convertToISODateString(argv.indexedDate),
    performerId: argv.performerId,
    outputVcfName: argv.outputVcfName,
    passFilter: argv.passFilter,
    updateSample: argv.updateSample,
    testId: argv.testId,
    sequenceId: argv.sequenceId,
    bodySite: argv.bodySite,
    bodySiteSystem: argv.bodySiteSystem,
    bodySiteDisplay: argv.bodySiteDisplay
  });
  print(response.data, argv);
};
