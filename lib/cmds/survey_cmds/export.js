'use strict'

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');

exports.command = 'export <projectId> <surveyId>';
exports.desc = 'Export all responses from the designated <surveyId> into a .csv file';
exports.builder = yargs => {
  yargs.positional('projectId', {
    describe: 'The ID of the project containing the survey.',
    type: 'string'
  }).positional('surveyId', {
    describe: 'The ID of the survey to export responses from.',
    type: 'string'
  });
};

function generateHeaderObject(searchObject, results) {
  if (searchObject.hasOwnProperty('linkId') && searchObject.hasOwnProperty('text') && searchObject.hasOwnProperty('type')) {
    if (searchObject.type != 'group') {
      results[searchObject.linkId] = searchObject.text;
    }
  }
  if (searchObject instanceof Array) {
    searchObject.forEach(subObject => generateHeaderObject(subObject, results));
  } else if (searchObject instanceof Object) {
    Object.keys(searchObject).forEach(key => generateHeaderObject(searchObject[key], results));
  }
}

function generateAnswerObject(searchObject, results, valid_link_ids) {
  if (searchObject.hasOwnProperty('linkId') && searchObject.hasOwnProperty('answer')) {
    if (valid_link_ids.includes(searchObject.linkId)) {
      results[searchObject.linkId] = searchObject.answer;
    }
  }
  if (searchObject instanceof Array) {
    searchObject.forEach(subObject => generateAnswerObject(subObject, results, valid_link_ids));
  } else if (searchObject instanceof Object) {
    Object.keys(searchObject).forEach(key => generateAnswerObject(searchObject[key], results, valid_link_ids));
  }
}

function handleDefaultValue(value) {
  let return_string = value[Object.keys(value)[0]];
  return return_string;
}

function handleValueCoding(coding) {
  if (coding.valueCoding.hasOwnProperty('display')) {
    return coding.valueCoding.display.replace(',', ';');
  } else if (coding.valueCoding.hasOwnProperty('code')) {
    return coding.valueCoding.code.replace(',', ';');
  } else {
    return '';
  }
}

function handleValueQuantity(quantity) {
  if (!(quantity.valueQuantity.hasOwnProperty('value') && quantity.valueQuantity.hasOwnProperty('unit'))) {
    return '';
  }
  const return_string = quantity.valueQuantity.value + ' ' + quantity.valueQuantity.unit;
  return return_string.replace(',', ';');
}

exports.handler = async argv => {
  const survey_url = `/v1/survey/projects/${argv.projectId}/surveys/${argv.surveyId}`;
  const survey = await get(argv, survey_url);
  let results = {};
  generateHeaderObject(survey.data, results);
  let header = ['Patient ID', 'Date'];
  let ordered_link_ids = ['', ''];
  Object.keys(results).forEach(key => {
    ordered_link_ids.push(key);
    header.push(results[key]);
  });
  const response_items = []
  const responses_query = querystring.stringify({
    'surveyId':`${argv.surveyId}`,
    'pageSize':1
  });
  const responses_url = `/v1/survey/projects/${argv.projectId}/responses?${responses_query}`;
  let responses = await get(argv, responses_url);
  response_items.push(...responses.data.items);
  while(responses.data.items.length > 0) {
    let next_page_url = responses.data.links.next;
    responses = await get(argv, next_page_url);
    response_items.push(...responses.data.items);
  }
  console.log(header.join());
  response_items.forEach(response_item => {
    let response = [];
    response.push(response_item.subject.reference);
    response.push(response_item.authored);
    let response_item_results = {};
    generateAnswerObject(response_item, response_item_results, ordered_link_ids);
    ordered_link_ids.forEach(linkId => {
      if (linkId != '') {
        if (response_item_results.hasOwnProperty(linkId)) {
          let response_string = '';
          response_item_results[linkId].forEach(value => {
            if (value.hasOwnProperty('valueQuantity')) {
              response_string = response_string.concat(handleValueQuantity(value));
            } else if (value.hasOwnProperty('valueCoding')) {
              response_string = response_string.concat(handleValueCoding(value));
            } else {
              response_string = response_string.concat(handleDefaultValue(value));
            }
            response_string = response_string.concat('|');
          });
          response.push(response_string.slice(0, -1))
        } else {
          response.push('')
        }
      }
    });
    console.log(response.join());
  });
};
