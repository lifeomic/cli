'use strict';

const { post } = require('../../api');
const { get } = require('../../api');
const print = require('../../print');
const fs = require('fs');

exports.command = 'create-config <projectId>';
exports.desc = 'Create or update OCR settings in project <projectId>.';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project which owns this OCR config.',
    type: 'string'
  }).options({
    'config-file': {
      describe: 'Path to JSON file containing full configuration',
      type: 'string'
    },
    d: {
      alias: 'denoiser-switch',
      describe: 'Flag for denoiser control. Allowed values: OFF|ON|SMART.',
      type: 'string'
    },
    s: {
      alias: 'spell-checker-switch',
      describe: 'Flag for spell-checker control. Allowed values: OFF|ON.',
      type: 'string'
    },
    a: {
      alias: 'analyze-switch',
      describe: 'Flag for analyze control. Allowed values: OFF|ON.',
      type: 'string'
    },
    c: {
      alias: 'classifier-switch',
      describe: 'Flag for analyze control. Allowed values: OFF|SEARCH|ML.',
      type: 'string'
    },
    p: {
      alias: 'path-prefix',
      describe: 'Path prefix on file-service where denoised and text files are stored',
      type: 'string'
    },
    t: {
      alias: 'template',
      describe: 'Generates an empty configFile template',
      type: 'boolean'
    }
  });
};

function assignDefined (target, source) {
  Object.keys(source).map((key) => {
    if (source[key] !== undefined) {
      target[key] = source[key];
    }
  });
  return target;
}

exports.handler = async argv => {
  if (argv.template) {
    // write template to stdout
    print(template, argv);
    return;
  }

  // get current config
  const getResponse = await get(argv, `/v1/ocr/config/${argv.projectId}`);
  const configFromGet = (getResponse.status === 200) ? getResponse.data.config : undefined;

  // read from config file
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const configFromFile = argv.configFile ? JSON.parse(fs.readFileSync(argv.configFile, { encoding: 'utf8' })) : undefined;

  // cli-args config
  const {denoiserSwitch, spellCheckerSwitch, analyzeSwitch, classifierSwitch, pathPrefix} = argv;
  const configFromArg = assignDefined({}, {
    denoiserSwitch,
    spellCheckerSwitch,
    analyzeSwitch,
    classifierSwitch,
    pathPrefix
  });

  // merge all configs
  const configData = Object.assign({}, configFromGet, configFromFile, configFromArg);
  const response = await post(argv, '/v1/ocr/config', {
    project: argv.projectId,
    config: configData
  });
  print(response.data, argv);
};

const template = {
  denoiserSwitch: 'ON | OFF | SMART',
  pathPrefix: 'ocr',
  documentClassifier: 'document-classifier-name',
  classifierSwitch: 'OFF | SEARCH | ML',
  analyzeSwitch: 'OFF | ON',
  spellCheckerSwitch: 'OFF | ON',
  searchLists: {
    lists: [
      {
        title: 'title-for-list-1',
        searchTerms: [
          {
            term: 'search-text-1',
            coding: { code: '1', display: 'display', system: 'lifeomic.com' },
            resourceType: ['MedicationAdministration']
          },
          { term: 'search-text-2' }
        ]
      },
      {
        title: 'title-for-list-22',
        searchTerms: [
          { term: 'search-text-3' },
          { term: 'search-text-4' }
        ]
      }
    ]
  }
};
