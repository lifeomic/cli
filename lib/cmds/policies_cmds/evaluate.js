'use strict';

const { get } = require('../../api');
const print = require('../../print');

exports.command = 'evaluate [userId]';
exports.desc = 'Evaluate your policy or the policy of another user';
exports.builder = yargs => {
  yargs.positional('userId', {
    describe: 'The user ID to evaluate a policy for.',
    type: 'string'
  });
};

exports.handler = async argv => {
  let response;

  if (argv.userId) {
    response = await get(argv, `/v1/evaluated-policy?user=${argv.userId}`);
  } else {
    response = await get(argv, `/v1/evaluated-policy`);
  }

  print(response.data, argv);
};
