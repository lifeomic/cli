'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const plainPrint = require('../../plainPrint');

exports.command = 'export-responses <projectId> <surveyId>';
exports.desc = 'Export all responses in .csv format';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project containing the survey.',
    type: 'string'
  }).positional('surveyId', {
    describe: 'The ID of the survey to export responses from.',
    type: 'string'
  });
};

function buildQuestionList (surveyItem, results) {
  if (surveyItem.linkId && surveyItem.text && surveyItem.type) {
    if (surveyItem.type !== 'group' && surveyItem.type !== 'display') {
      results.push({
        text: surveyItem.text.replace(/\n/g, ' ').replace(/"/g, '""'),
        linkId: surveyItem.linkId
      });
    }
  }
  if (surveyItem.item) {
    (surveyItem.item || []).forEach(_ => buildQuestionList(_, results));
  }
}

function generateLinkAnswerHash (responseItem, results) {
  if (responseItem.linkId && responseItem.answer) {
    results[responseItem.linkId] = responseItem.answer;
  }
  if (responseItem.item) {
    (responseItem.item || []).forEach(_ => generateLinkAnswerHash(_, results));
  }
}

function handleDefaultValue (value) {
  return value[Object.keys(value)[0]];
}

function handleValueCoding (coding) {
  if (coding.valueCoding.display) {
    return coding.valueCoding.display;
  } else if (coding.valueCoding.code) {
    return coding.valueCoding.code;
  } else {
    return '';
  }
}

function handleValueQuantity (responseValue) {
  const {
    value = '',
    unit = ''
  } = responseValue.valueQuantity || {};
  return `${value} ${unit}`;
}

exports.handler = async argv => {
  const surveyUrl = `/v1/survey/projects/${argv.projectId}/surveys/${argv.surveyId}`;
  const survey = await get(argv, surveyUrl);
  const results = [{text: 'Patient ID', linkId: ''}, {text: 'Date', linkId: ''}];
  (survey.data.item || []).forEach(_ => buildQuestionList(_, results));
  const responseItems = [];
  const responseQuery = querystring.stringify({
    'surveyId': `${argv.surveyId}`,
    'pageSize': 10
  });
  const responsesUrl = `/v1/survey/projects/${argv.projectId}/responses?${responseQuery}`;
  let responses = await get(argv, responsesUrl);
  responseItems.push(...responses.data.items);
  while (responses.data.links.next) {
    const nextPageUrl = responses.data.links.next;
    responses = await get(argv, nextPageUrl);
    responseItems.push(...responses.data.items);
  }
  const csvRows = [];
  csvRows.push(`"${results.map(_ => _.text).join('","')}"`);
  responseItems.forEach(responseItem => {
    const responseColumns = [];
    responseColumns.push(responseItem.subject.reference);
    responseColumns.push(responseItem.authored);
    const responseItemResults = {};
    (responseItem.item || []).forEach(_ => generateLinkAnswerHash(_, responseItemResults));
    results.map(_ => _.linkId)
      .filter(_ => _ !== '')
      .forEach(linkId => {
        if (responseItemResults[linkId]) {
          let responseString = '';
          responseItemResults[linkId].forEach(value => {
            if (value.valueQuantity) {
              responseString = responseString.concat(handleValueQuantity(value));
            } else if (value.valueCoding) {
              responseString = responseString.concat(handleValueCoding(value));
            } else {
              responseString = responseString.concat(handleDefaultValue(value));
            }
            responseString = responseString.concat('|');
          });
          responseColumns.push(responseString.slice(0, -1).replace(/"/g, '""').replace(/\n/g, ' '));
        } else {
          // optional questions may not have answers
          responseColumns.push('');
        }
      });
    csvRows.push(`"${responseColumns.join('","')}"`);
  });
  plainPrint(csvRows.join('\n'));
};
