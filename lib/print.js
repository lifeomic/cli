'use strict';

const prettyjson = require('prettyjson');

module.exports = function (data, options) {
  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(prettyjson.render(data));
  }
};
