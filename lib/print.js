'use strict';

const yaml = require('js-yaml');

module.exports = function (data, options) {
  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(yaml.safeDump(data));
  }
};
