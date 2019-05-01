'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');

const fs = require('fs');

const proxyquire = require('proxyquire');

let callback;

const stubs = {
  patch: sinon.stub(),
  stdin: sinon.stub()
};

const spies = {
  print: sinon.spy()
};

const mocks = {
  '../../api': {
    patch: stubs.patch
  },
  '../../print': (data, opts) => {
    spies.print(data, opts);
    callback();
  },
  '../../stdin': () => stubs.stdin()
};

const _import = proxyquire('../../../lib/cmds/ontologies_cmds/import', mocks);

test.afterEach.always(t => {
  Object.values(stubs).forEach(stub => stub.resetHistory());
  Object.values(spies).forEach(spy => spy.resetHistory());
  callback = null;
});

test.serial.cb('import: file with json array', t => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const stdin = fs.createReadStream(`${__dirname}/ontologies/array.json`);
  stubs.stdin.returns(stdin);

  const data = 'Created';
  const res = { data: data };
  stubs.patch.onFirstCall().returns(res);

  const project = '9ce94182-f9b6-4043-99c7-420c77c965aa';
  callback = () => {
    // Assert that 'patch' is issued once for each record
    t.is(1, stubs.patch.callCount);
    t.is(`/v1/terminology/projects/${project}/relationships/`, stubs.patch.getCall(0).args[1]);

    // Assert print is invoked once with the HTTP response data
    t.is(1, spies.print.callCount);
    t.deepEqual(data, spies.print.getCall(0).args[0]);

    t.end();
  };

  yargs.command(_import).parse(`import ${project}`);
});

test.serial.cb('import: flat file with json object', t => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const stdin = fs.createReadStream(`${__dirname}/ontologies/flat.json`);
  stubs.stdin.returns(stdin);

  const data = 'Created';
  const res = { data: data };
  stubs.patch.onFirstCall().returns(res);

  const project = '9ce94182-f9b6-4043-99c7-420c77c965aa';
  callback = () => {
    // Assert that 'patch' is issued once for each record
    t.is(1, stubs.patch.callCount);
    t.is(`/v1/terminology/projects/${project}/relationships/`, stubs.patch.getCall(0).args[1]);

    // Assert print is invoked once with the HTTP response data
    t.is(1, spies.print.callCount);
    t.deepEqual(data, spies.print.getCall(0).args[0]);

    t.end();
  };

  yargs.command(_import).parse(`import ${project}`);
});

test.serial.cb('import: chunk over flat file with json array larger than batch size', t => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const stdin = fs.createReadStream(`${__dirname}/ontologies/chunked.json`);
  stubs.stdin.returns(stdin);

  const data = 'Created';
  const res = { data: data };
  stubs.patch.onFirstCall().returns(res);
  stubs.patch.onSecondCall().returns(res);

  const project = '9ce94182-f9b6-4043-99c7-420c77c965aa';
  callback = () => {
    // Assert that 'patch' is issued once for each record
    t.is(1, stubs.patch.callCount);
    t.is(`/v1/terminology/projects/${project}/relationships/`, stubs.patch.getCall(0).args[1]);

    // Assert print is invoked once with the HTTP response data
    t.is(1, spies.print.callCount);
    t.deepEqual(data, spies.print.getCall(0).args[0]);

    t.end();
  };

  yargs.command(_import).parse(`import ${project} --batch-size 1`);
});
