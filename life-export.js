#!/usr/bin/env node

const _get = require('lodash/get');
const chalk = require('chalk');
const execa = require('execa');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');

const DATA_DIR = 'life-data';
const LIFE_PROJECT = 'f82a69fb-3f0c-4405-9b7f-8df05aaec159';
const LO = os.platform() === 'win32' ? 'lo.exe' : './lo';

(async () => {
  await mkdirp(DATA_DIR);
  console.log(chalk.green('LIFE data will be exported into directory named:'), chalk.bold(DATA_DIR));

  console.log(chalk.green('Configuring with defaults...'));
  const defaults = execa(LO, [
    'setup',
    '--environment',
    'prod-us',
    '--account',
    'lifeomiclife',
    '--clientId',
    '2qt93qphnctjbs9ftdpjhvgkl1'
  ]);
  defaults.stdout.pipe(process.stdout);
  await defaults;

  console.log(chalk.green('Authenticating...'));
  const auth = execa(LO, ['auth']);
  auth.stdout.pipe(process.stdout);
  await auth;

  console.log(chalk.green('Fetching FHIR me...'));
  const me = execa(LO, [
    'fhir',
    'me',
    '--json',
    '--account',
    'lifeomiclife'
  ]);
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  me.stdout.pipe(fs.createWriteStream(`${DATA_DIR}/me.json`));
  const { stdout: meStdout } = await me;

  const meId = _get(JSON.parse(meStdout), 'entry[0].resource.id');
  console.log(chalk.green('User Identifier:'), chalk.bold(meId));
  console.log(chalk.green(`Me exported: ✅`));

  const FHIR_TYPES = ['Procedure', 'Observation', 'Goal'];
  for (const type of FHIR_TYPES) {
    console.log(chalk.green(`Fetching ${type}...`));
    const subprocess = execa(LO, [
      'fhir',
      'list',
      type,
      '--project',
      LIFE_PROJECT,
      `--query`,
      `subject=${meId}`,
      '--json',
      '--account',
      'lifeomiclife'
    ]);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    subprocess.stdout.pipe(fs.createWriteStream(`${DATA_DIR}/${type}.json`));
    await subprocess;

    console.log(chalk.green(`${type} exported: ✅`));
  }
  console.log(chalk.green('LIFE data export complete.'));
})();
