'use strict';

const querystring = require('querystring');
const { get } = require('../../api');
const print = require('../../print');

exports.command = 'list <projectId>';
exports.desc = 'List surveys in the specified project';
exports.builder = (yargs) => {
  yargs.positional('projectId', {
    describe: 'The ID of the project containing the survey.',
    type: 'string'
  });
};

exports.handler = async (argv) => {
  const surveyQuery = querystring.stringify({
    'pageSize': 10
  });
  const surveyUrl = `/v1/survey/projects/${argv.projectId}/surveys?${surveyQuery}`;
  let surveyResponse = await get(argv, surveyUrl);
  const surveys = [];
  surveys.push(...surveyResponse.data.items);
  while (surveyResponse.data.links.next) {
    surveyResponse = await get(argv, surveyResponse.data.links.next);
    surveys.push(...surveyResponse.data.items);
  }
  surveys.forEach(survey => {
    delete survey.resourceType;
    delete survey.meta;
    delete survey.item;
    delete survey.subjectType;
  });
  print(surveys, argv);
};
