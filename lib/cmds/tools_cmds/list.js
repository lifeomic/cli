'use strict';

const { list } = require('../../tool');
const print = require('../../print');
const querystring = require('querystring');

exports.command = 'list';
exports.desc = 'List tools by dataset.';
exports.builder = yargs => {
  yargs
    .option('tool-class', {
      describe: 'The class of the tool',
      alias: 'c',
      choices: ['Workflow', 'Notebook'],
      type: 'string',
      demandOption: false
    })
    .option('organization', {
      describe: 'The organization that owns the tool',
      alias: 'o',
      type: 'string',
      demandOption: false
    })
    .option('toolname', {
      describe: 'The name of the tool',
      alias: 'n',
      type: 'string',
      demandOption: false
    })
    .option('author', {
      describe: 'The author of the tool',
      alias: 'a',
      type: 'string',
      demandOption: false
    })
    .option('label', {
      describe: 'Labels applied to the tool, as a comma delimited string, i.e. "bam,samtools"',
      alias: 'l',
      type: 'string',
      demandOption: false
    });
};

exports.handler = async argv => {
  const opts = {
  };

  if (argv.toolClass) {
    opts.toolClass = argv.toolClass;
  }

  if (argv.organization) {
    opts.organization = argv.organization;
  }

  if (argv.toolname) {
    opts.toolname = argv.toolname;
  }

  if (argv.author) {
    opts.author = argv.author;
  }

  if (argv.label) {
    opts.label = argv.label;
  }

  const response = await list(argv, `/trs/v2/tools?${querystring.stringify(opts)}`);
  print(response, argv);
  console.log(`/trs/v2/tools?${querystring.stringify(opts)}`);
};
