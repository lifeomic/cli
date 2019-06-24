'use strict';

const test = require('ava');
const sinon = require('sinon');

const proxyquire = require('proxyquire');

const prettyoutput = sinon.stub();

const print = proxyquire('../../lib/print', {
  'prettyoutput': prettyoutput
});

test.beforeEach(t => {
  prettyoutput.reset();
});

test('non tty output (e.g. pipe) should suppress colorization so downstream text parsing is not broken', async t => {
  process.stdout.isTTY = false;

  const data = {foo: 'bar'};
  print(data, {});
  t.pass(sinon.assert.calledWithExactly(prettyoutput, data, {noColor: true}));
});

test('tty output (e.g. terminal) should colorize', async t => {
  process.stdout.isTTY = true;

  const data = {foo: 'bar'};
  print(data, {});
  t.pass(sinon.assert.calledWithExactly(prettyoutput, data, {noColor: false}));
});
