'use strict';

const querystring = require('querystring');
const moment = require('moment');
const _find = require('lodash/find');
const { get } = require('../../api');
const { get: fhirGet, getAccount } = require('../../fhir');
const print = require('../../print');
const sleep = require('../../sleep');

const waitSeconds = 900;

const getStatus = async argv => {
  let status = 'RUNNING';
  let count = 0;
  do {
    const account = getAccount(argv);
    const url = `/${account}/dstu3/DocumentReference/${argv.documentId}`;
    const response = await fhirGet(argv, url);
    const tag = response.data && response.data.meta && response.data.meta.tag;
    if (!tag) {
      status = 'ERROR';
      break;
    }
    status = _find(tag, {system: 'http://lifeomic.com/ocr/document/status'}).code;
    count++;
    if (status.includes('RUNNING')) await sleep(1000);
  } while (status.includes('RUNNING') && count < waitSeconds);
  if (!status.includes('RUNNING') && !status.includes('ERROR')) status = 'SUCCESS';
  return status;
};

const getSuggestions = async (argv, nextPageToken) => {
  const suggestionsQuery = querystring.stringify({
    'pageSize': 25,
    ...nextPageToken && { nextPageToken }
  });
  const suggestionsUrl =
    `/v1/ocr/fhir/projects/${argv.projectId}/documentReferences/${argv.documentId}/suggestions?${suggestionsQuery}`;
  const response = await get(argv, suggestionsUrl);
  return response;
};

const loadAnalyzeSuggestions = async argv => {
  const results = [];
  let nextPageToken = '';
  do {
    const response = await getSuggestions(argv, nextPageToken);
    const { records, nextPageToken: responseToken } = response.data || {};

    results.push(...(records || []));
    nextPageToken = responseToken
      ? JSON.stringify(responseToken)
      : undefined;
  } while (nextPageToken);

  return results;
};

const resolveValue = (value, resolver) => {
  const extractedValue = value[0] && value[0].value;
  if (!extractedValue) return null;
  return resolver(extractedValue);
};

const dateSuggestionResolver = dateString => {
  const asMoment = moment(dateString);
  if (!asMoment.isValid()) return null;

  return asMoment.format('YYYY-MM-DD').toString();
};

const codingSuggestionResolver = coding => {
  if (!coding.code && !coding.display && !coding.system) return null;
  return coding;
};

const observationValueStringResolver = valueString => {
  if (!(typeof valueString === 'string')) return null;
  return valueString;
};

const observationValueQuantityResolver = valueQuantity => {
  if (typeof valueQuantity === 'string') return null;
  return valueQuantity;
};

const medicationDosageResolver = dosage => {
  if (dosage.id) delete dosage.id;
  return Object.entries(dosage)
    .filter(([_, value]) => !!value)
    .map(([message, value]) => `${message.charAt(0).toUpperCase() + message.slice(1)}: ${value}`)
    .join(', ') || null;
};

const bodySiteResolver = bodySiteArray => {
  if (!bodySiteArray.length || !bodySiteArray[0].length) return null;
  const bodySites = bodySiteArray[0]
    .filter(_ => _ && _.value)
    .map(_ => codingSuggestionResolver(_.value));
  return bodySites.length ? bodySites : null;
};

const getDate = (startDate, endDate, periodName, dateName) => {
  if (!startDate && !endDate) return null;
  const date = {};
  if (!endDate) {
    date[dateName] = startDate;
  } else {
    date[periodName] = {
      start: startDate,
      end: endDate
    };
  }
  return date;
};

const conditionallyAddField = (fieldName, field) => {
  const fieldObject = {};
  if (field) fieldObject[fieldName] = field;
  return fieldObject;
};

const filterSuggestions = response => {
  if (!response || !response.length) return;
  const filteredSuggestions = [];
  const potentialSuggestions = response.map(_ => ({ suggestion: _.suggestions[0] }));

  potentialSuggestions.forEach(potentialSuggestion => {
    const { condition, observation, procedure, medicationAdministration } = potentialSuggestion.suggestion;
    const extractedCondition = {
      resourceType: 'Condition',
      code: resolveValue(condition.conditionCode, codingSuggestionResolver),
      ...conditionallyAddField('onsetDateTime', resolveValue(condition.onsetDate, dateSuggestionResolver)),
      ...conditionallyAddField('abatementDateTime', resolveValue(condition.abatementDate, dateSuggestionResolver)),
      ...conditionallyAddField('bodySite', bodySiteResolver(condition.bodySite))
    };
    const extractedObservation = {
      resourceType: 'Observation',
      code: resolveValue(observation.observationCode, codingSuggestionResolver),
      ...conditionallyAddField('effectiveDateTime', resolveValue(observation.date, dateSuggestionResolver)),
      ...conditionallyAddField('valueQuantity', resolveValue(observation.value, observationValueQuantityResolver)),
      ...conditionallyAddField('valueString', resolveValue(observation.value, observationValueStringResolver)),
      status: 'unknown'
    };
    const extractedProcedure = {
      resourceType: 'Procedure',
      code: resolveValue(procedure.procedureCode, codingSuggestionResolver),
      ...getDate(
        resolveValue(procedure.date, dateSuggestionResolver),
        resolveValue(procedure.endDate, dateSuggestionResolver),
        'performedPeriod',
        'performedDateTime'
      ),
      ...conditionallyAddField('bodySite', bodySiteResolver(procedure.bodySite)),
      status: 'unknown'
    };
    const medicationDosage = resolveValue(medicationAdministration.dosage, medicationDosageResolver);
    const extractedMedicationAdministration = {
      resourceType: 'MedicationAdministration',
      ...getDate(
        resolveValue(medicationAdministration.date, dateSuggestionResolver),
        resolveValue(medicationAdministration.endDate, dateSuggestionResolver),
        'effectivePeriod',
        'effectiveDateTime'
      ),
      medicationCodeableConcept: resolveValue(medicationAdministration.medicationCode, codingSuggestionResolver),
      ...medicationDosage && { dosage: { text: medicationDosage } },
      status: (medicationAdministration.status[0] && medicationAdministration.status[0].value) || 'unknown'
    };
    if (extractedMedicationAdministration.medicationCodeableConcept || extractedMedicationAdministration.dosage) {
      filteredSuggestions.push(extractedMedicationAdministration);
    }
    if (extractedCondition.code) {
      filteredSuggestions.push(extractedCondition);
    }
    if (extractedObservation.code) {
      filteredSuggestions.push(extractedObservation);
    }
    if (extractedProcedure.code) {
      filteredSuggestions.push(extractedProcedure);
    }
  });

  return filteredSuggestions;
};

exports.command = 'get-suggestions <projectId> <documentId>';
exports.desc = 'Fetch suggestions from the document <documentId> in project <projectId>';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project this document is in.',
    type: 'string'
  }).positional('documentId', {
    describe: 'The ID of the document to fetch suggestions from.',
    type: 'string'
  }).option({
    s: {
      alias: 'suggestions',
      describe: 'Output unformatted suggestions instead of filtered FHIR',
      type: 'boolean'
    }
  }).option({
    w: {
      alias: 'wait',
      describe: 'Wait up to 15 minutes for the document to finish processing, if applicable',
      type: 'boolean'
    }
  });
};

exports.handler = async argv => {
  if (argv.wait) {
    const status = await getStatus(argv);
    if (status.includes('ERROR')) print('Error occurred while fetching document status.', argv);
    else if (status.includes('RUNNING')) print('Timeout reached while waiting for document to process', argv);
    if (status !== 'SUCCESS') return;
  }
  const response = await loadAnalyzeSuggestions(argv);
  if (argv.suggestions) {
    print(response, argv);
    return;
  }
  const filteredSuggestions = filterSuggestions(response);
  print(filteredSuggestions, argv);
};
