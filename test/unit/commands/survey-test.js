'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const questionnaire = require('./survey/questionnaire.json');
const responseOne = require('./survey/response_one.json');
const responseTwo = require('./survey/response_two.json');

const surveyOne = require('./survey/survey_response_one.json');
const surveyTwo = require('./survey/survey_response_two.json');

const getStub = sinon.stub();
const plainPrintSpy = sinon.spy();
const printSpy = sinon.spy();
let callback;

const mocks = {
  '../../api': {
    get: getStub
  },
  '../../plainPrint': (data) => {
    plainPrintSpy(data);
    callback();
  },
  '../../print': (data, argv) => {
    printSpy(data, argv);
    callback();
  }
};

const exportResponses = proxyquire('../../../lib/cmds/survey_cmds/export-responses', mocks);
const list = proxyquire('../../../lib/cmds/survey_cmds/list', mocks);

test.afterEach.always(t => {
  getStub.reset();
  plainPrintSpy.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The export command should list responses in csv format', t => {
  getStub.onFirstCall().returns(questionnaire);
  getStub.onSecondCall().returns(responseOne);
  getStub.onThirdCall().returns(responseTwo);

  callback = () => {
    t.is(getStub.callCount, 3);
    t.is(getStub.getCall(0).args[1], '/v1/survey/projects/projectId/surveys/surveyId');
    t.is(getStub.getCall(1).args[1], '/v1/survey/projects/projectId/responses?surveyId=surveyId&pageSize=10');
    t.is(getStub.getCall(2).args[1], 'testurl');
    t.is(plainPrintSpy.callCount, 1);
    t.is(plainPrintSpy.getCall(0).args[0], '"Patient ID","Date","Systolic blood pressure","Diastolic blood pressure","What country do you live in?"\n"73d77961-a8b7-48e0-b76f-66e53485038b","2020-06-04T14:56:14.402Z","120 millimeter of mercury","80 millimeter of mercury","United States of America"\n"73d77961-a8b7-48e0-b76f-66e53485038b","2020-06-04T14:56:14.402Z","120 millimeter of mercury","80 millimeter of mercury","United States of America"');
    t.end();
  };

  yargs.command(exportResponses)
    .parse('export-responses projectId surveyId');
});

test.serial.cb('The list command should list all surveys in the project', t => {
  getStub.onFirstCall().returns(surveyOne);
  getStub.onSecondCall().returns(surveyTwo);

  callback = () => {
    t.is(getStub.callCount, 2);
    t.is(getStub.getCall(0).args[1], '/v1/survey/projects/projectId/surveys?pageSize=10');
    t.is(getStub.getCall(1).args[1], 'nexturl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [
      {
        status: 'active',
        title: 'Test Survey 1',
        description: 'Test Survey 1',
        date: '2020-06-04T14:55:45.367Z',
        version: '1.0',
        id: '1'
      },
      {
        status: 'active',
        title: 'Test Survey 2',
        description: 'Test Survey 2',
        date: '2020-06-04T14:55:45.367Z',
        version: '1.0',
        id: '2'
      }
    ]);
    t.end();
  };

  yargs.command(list)
    .parse('list projectId');
});
