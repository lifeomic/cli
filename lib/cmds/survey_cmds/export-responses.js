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

function generateHeaderObject (searchObject, results) {
  if (searchObject.hasOwnProperty('linkId') && searchObject.hasOwnProperty('text') && searchObject.hasOwnProperty('type')) {
    if (searchObject.type !== 'group' && searchObject.type !== 'display') {
      results[searchObject.linkId] = searchObject.text.replace(/\n/g, ' ').replace(/"/g, '""');
    }
  }
  if (searchObject instanceof Array) {
    searchObject.forEach(subObject => generateHeaderObject(subObject, results));
  } else if (searchObject instanceof Object) {
    Object.keys(searchObject).forEach(key => generateHeaderObject(searchObject[key], results));
  }
}

function generateAnswerObject (searchObject, results, validLinkIds) {
  if (searchObject.hasOwnProperty('linkId') && searchObject.hasOwnProperty('answer')) {
    if (validLinkIds.includes(searchObject.linkId)) {
      results[searchObject.linkId] = searchObject.answer;
    }
  }
  if (searchObject instanceof Array) {
    searchObject.forEach(subObject => generateAnswerObject(subObject, results, validLinkIds));
  } else if (searchObject instanceof Object) {
    Object.keys(searchObject).forEach(key => generateAnswerObject(searchObject[key], results, validLinkIds));
  }
}

function handleDefaultValue (value) {
  return value[Object.keys(value)[0]];
}

function handleValueCoding (coding) {
  if (coding.valueCoding.hasOwnProperty('display')) {
    return coding.valueCoding.display;
  } else if (coding.valueCoding.hasOwnProperty('code')) {
    return coding.valueCoding.code;
  } else {
    return '';
  }
}

function handleValueQuantity (quantity) {
  if (!(quantity.valueQuantity.hasOwnProperty('value') && quantity.valueQuantity.hasOwnProperty('unit'))) {
    return '';
  }
  return quantity.valueQuantity.value + ' ' + quantity.valueQuantity.unit;
}

exports.handler = async argv => {
  const surveyUrl = `/v1/survey/projects/${argv.projectId}/surveys/${argv.surveyId}`;
  const survey = await get(argv, surveyUrl);
  const results = {};
  generateHeaderObject(survey.data, results);
  const header = ['Patient ID', 'Date'];
  const orderedLinkIds = ['', ''];
  Object.keys(results).forEach(key => {
    orderedLinkIds.push(key);
    header.push(results[key]);
  });
  const responseItems = [];
  const responseQuery = querystring.stringify({
    'surveyId': `${argv.surveyId}`,
    'pageSize': 10
  });
  const responsesUrl = `/v1/survey/projects/${argv.projectId}/responses?${responseQuery}`;
  let responses = await get(argv, responsesUrl);
  responseItems.push(...responses.data.items);
  while (responses.data.links.hasOwnProperty('next')) {
    const nextPageUrl = responses.data.links.next;
    responses = await get(argv, nextPageUrl);
    responseItems.push(...responses.data.items);
  }
  const allResponses = [];
  allResponses.push('"' + header.join('","') + '"');
  responseItems.forEach(responseItem => {
    const response = [];
    response.push(responseItem.subject.reference);
    response.push(responseItem.authored);
    const responseItemResults = {};
    generateAnswerObject(responseItem, responseItemResults, orderedLinkIds);
    orderedLinkIds.forEach(linkId => {
      if (linkId !== '') {
        if (responseItemResults.hasOwnProperty(linkId)) {
          let responseString = '';
          responseItemResults[linkId].forEach(value => {
            if (value.hasOwnProperty('valueQuantity')) {
              responseString = responseString.concat(handleValueQuantity(value));
            } else if (value.hasOwnProperty('valueCoding')) {
              responseString = responseString.concat(handleValueCoding(value));
            } else {
              responseString = responseString.concat(handleDefaultValue(value));
            }
            responseString = responseString.concat('|');
          });
          response.push(responseString.slice(0, -1).replace(/"/g, '""').replace(/\n/g, ' '));
        } else {
          response.push('');
        }
      }
    });
    allResponses.push('"' + response.join('","') + '"');
  });
  plainPrint(allResponses.join('\n'));
};
