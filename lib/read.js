'use strict';

const yaml = require('js-yaml');
const getStdin = require('get-stdin');

module.exports = async function (options) {
  if (options.json) {
    return JSON.parse(await getStdin());
  } else {
    return yaml.safeLoad(await getStdin());
  }
};
