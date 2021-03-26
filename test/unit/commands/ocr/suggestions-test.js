'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const suggestions = require('./suggestions.json');

const getStub = sinon.stub();
const fhirGetStub = sinon.stub();
const printSpy = sinon.spy();
const sleepStub = sinon.stub().resolves();
let callback;

const mocks = {
  '../../api': {
    get: getStub
  },
  '../../fhir': {
    get: fhirGetStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../sleep': sleepStub
};

const getSuggestions = proxyquire('../../../../lib/cmds/ocr_cmds/get-suggestions', mocks);

test.afterEach.always(() => {
  getStub.reset();
  fhirGetStub.reset();
  printSpy.resetHistory();
  sleepStub.reset();
  callback = null;
});

test.serial.cb('The "ocr get-suggestions" command should get suggestions in FHIR format', t => {
  getStub.onFirstCall().returns(suggestions);

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(
      getStub.getCall(0).args[1],
      '/v1/ocr/fhir/projects/projectId/documentReferences/documentId/suggestions?pageSize=25'
    );
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], [
      {
        resourceType: 'MedicationAdministration',
        status: 'completed',
        medicationCodeableConcept: {
          code: '643722',
          display: 'lenalidomide 25 MG Oral Capsule [Revlimid]',
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm'
        },
        dosage: {
          text: 'Dosage: 25 mg, Form: Tablet, Frequencey: 4 times per day, Route: Oral'
        },
        effectivePeriod: {
          start: '2020-01-01',
          end: '2021-01-01'
        }
      },
      {
        resourceType: 'Condition',
        code: {
          code: 'M25.50',
          display: 'Pain in unspecified joint',
          system: 'http://hl7.org/fhir/sid/icd-10'
        },
        bodySite: [
          {
            code: '362052004',
            display: 'Entire arterial rete of elbow joint',
            system: 'http://snomed.info/sct'
          }
        ],
        onsetDateTime: '2010-01-01',
        abatementDateTime: '2010-01-02'
      }
    ]);
    t.end();
  };

  yargs.command(getSuggestions)
    .parse('get-suggestions projectId documentId');
});

test.serial.cb('The "ocr get-suggestions" command will print unformatted suggestions when specified', t => {
  getStub.onFirstCall().returns(suggestions);

  callback = () => {
    t.is(getStub.callCount, 1);
    t.is(
      getStub.getCall(0).args[1],
      '/v1/ocr/fhir/projects/projectId/documentReferences/documentId/suggestions?pageSize=25'
    );
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], suggestions.data.records);
    t.end();
  };

  yargs.command(getSuggestions)
    .parse('get-suggestions projectId documentId -s');
});

test.serial.cb('The "ocr get-suggestions" command will wait when specified', t => {
  const running = {
    data: {
      meta: {
        tag: [
          {
            system: 'http://lifeomic.com/ocr/document/status',
            code: 'NLP-RUNNING'
          }
        ]
      }
    }
  };
  const success = {
    data: {
      meta: {
        tag: [
          {
            system: 'http://lifeomic.com/ocr/document/status',
            code: 'SUCCESS'
          }
        ]
      }
    }
  };
  getStub.onFirstCall().returns(suggestions);
  fhirGetStub.onFirstCall().returns(running);
  fhirGetStub.onSecondCall().returns(running);
  fhirGetStub.onThirdCall().returns(success);
  callback = () => {
    t.is(fhirGetStub.callCount, 3);
    t.is(getStub.callCount, 1);
    t.is(sleepStub.callCount, 2);
    t.is(sleepStub.firstCall.args[0], 1000);
    t.is(sleepStub.secondCall.args[0], 1000);
    t.is(printSpy.callCount, 1);
    t.end();
  };

  yargs.command(getSuggestions)
    .parse('get-suggestions projectId documentId -w');
});
