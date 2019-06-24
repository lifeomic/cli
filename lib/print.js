'use strict';

const prettyoutput = require('prettyoutput');
const jsome = require('jsome');
jsome.params.lintable = true;
jsome.colors = {
  'num': 'cyan',
  'str': 'white',
  'bool': 'red',
  'regex': 'blue',
  'undef': 'grey',
  'null': 'grey',
  'attr': 'green',
  'quot': 'gray',
  'punc': 'gray',
  'brack': 'gray'
};

module.exports = function (data, options) {
  if (options.json) {
    jsome(data);
  } else if (options.jsonLine) {
    console.log(JSON.stringify(data, null, 0));
  } else {
    console.log(prettyoutput(data, {noColor: !process.stdout.isTTY}));
  }
};
