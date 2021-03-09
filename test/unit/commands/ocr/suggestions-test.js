'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const suggestions = require('./suggestions.json');

const getStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const mocks = {
  '../../api': {
    get: getStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const getSuggestions = proxyquire('../../../../lib/cmds/ocr_cmds/get-suggestions', mocks);

test.afterEach.always(t => {
  getStub.resetHistory();
  printSpy.resetHistory();
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
          start: 'Wed Jan 01 2020 00:00:00 GMT-0600',
          end: 'Fri Jan 01 2021 00:00:00 GMT-0600'
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
        onsetDateTime: 'Fri Jan 01 2010 00:00:00 GMT-0600',
        abatementDateTime: 'Sat Jan 02 2010 00:00:00 GMT-0600'
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
