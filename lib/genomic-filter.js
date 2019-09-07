'use strict';

const { get, getAccount } = require('./fhir');

module.exports = async function (sets, argv) {
  if (sets === undefined || sets.length === 0) {
    return sets;
  }

  const filteredSets = sets
    .filter(d => (!argv.missingPatient || d.patientId === undefined) &&
      (!argv.missingSequence || d.sequenceId === undefined) &&
      (!argv.missingSamples || (d.status === 'ACTIVE' && (!d.samples ||
        (d.samples.length === 0 || d.samples.filter(s => s.sampleId).length === 0)))));

  const results = [];
  for (let i = 0; i < filteredSets.length; i++) {
    if (await includeSequenceInResults(argv, filteredSets[i].sequenceId)) {
      results.push(filteredSets[i]);
    }
  }

  return results
    .map(d => argv.onlyIds ? d.id : d);
};

async function includeSequenceInResults (argv, id) {
  if (argv.missingFhirSequence) {
    if (id === undefined) {
      return false;
    }
    try {
      const account = getAccount(argv);
      const url = `/${account}/dstu3/Sequence/${id}`;
      await get(argv, url);
      // we only return true if we get the 404 err
      return false;
    } catch (err) {
      if (err.message === 'Request failed with status code 404') {
        return true;
      }

      console.error(err);
      return false;
    }
  }

  return true;
}
