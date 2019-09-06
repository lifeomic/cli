'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');

const genomicFilter = proxyquire(`../../lib/genomic-filter`, {
  './fhir': {
    get (options, path, config) {
      if (path === '/lifeomic/dstu3/Sequence/sequence2') {
        throw new Error('Request failed with status code 404');
      }

      return {};
    }
  }
});

test('genomic-filter should filter patientId arguments if true', async t => {
  const argv = {
    missingPatient: true
  };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, [{
    id: 'id2',
    sequenceName: 'sequenceName'
  }]);
});

test('genomic-filter should not filter patientId arguments if false', async t => {
  const argv = {
    missingPatient: false
  };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, [{
    id: 'id1',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }]);
});

test('genomic-filter should filter sequenceId arguments if true', async t => {
  const argv = {
    missingSequence: true
  };

  const sets = [{
    id: 'id1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, [{
    id: 'id2',
    sequenceName: 'sequenceName'
  }]);
});

test('genomic-filter should not filter sequenceId arguments if false', async t => {
  const argv = {
    missingSequence: false
  };

  const sets = [{
    id: 'id1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, [{
    id: 'id1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }]);
});

test('genomic-filter should filter patientId/sequenceId arguments if both are true', async t => {
  const argv = {
    missingPatient: true,
    missingSequence: true
  };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id4',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, [{
    id: 'id2',
    sequenceName: 'sequenceName'
  }]);
});

test('genomic-filter should not filter patientId/sequenceId arguments if both are false', async t => {
  const argv = {
    missingPatient: false,
    missingSequence: false
  };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id4',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, [{
    id: 'id1',
    patientId: 'patient1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id4',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }]);
});

test('genomic-filter should not filter patientId/sequenceId arguments dont exit', async t => {
  const argv = { };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id4',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, [{
    id: 'id1',
    patientId: 'patient1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id4',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }]);
});

test('genomic-filter should filter print only ids if only-ids argument is used', async t => {
  const argv = {
    onlyIds: true
  };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id4',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, ['id1', 'id2', 'id3', 'id4']);
});

test('genomic-filter should filter print only ids if only-ids argument is used when including filters', async t => {
  const argv = {
    onlyIds: true,
    missingSequence: true
  };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName'
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id4',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, ['id2', 'id3']);
});

test('genomic-filter should filter missing samples for ACTIVE records', async t => {
  const argv = {
    missingSamples: true
  };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    status: 'ACTIVE',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName',
    status: 'ACTIVE',
    samples: [{
      sampleId: 'SA-QWERTY',
      patientId: 'c89e14b7-af05-4c38-865c-a607c295adb2'
    }]
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName',
    status: 'INDEXING',
    samples: [{
      sampleId: 'SA-QWERTY',
      patientId: 'c89e14b7-af05-4c38-865c-a607c295adb2'
    }]
  }, {
    id: 'id4',
    status: 'INDEXING',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }];

  const results = await genomicFilter(sets, argv);
  t.deepEqual(results, [{
    id: 'id1',
    patientId: 'patient1',
    status: 'ACTIVE',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }]);
});

test('genomic-filter should filter missing FHIR sequences', async t => {
  const argv = {
    missingFhirSequence: true
  };

  const sets = [{
    id: 'id1',
    patientId: 'patient1',
    status: 'ACTIVE',
    sequenceId: 'sequence1',
    sequenceName: 'sequenceName'
  }, {
    id: 'id2',
    sequenceName: 'sequenceName',
    status: 'ACTIVE',
    samples: [{
      sampleId: 'SA-QWERTY',
      patientId: 'c89e14b7-af05-4c38-865c-a607c295adb2'
    }]
  }, {
    id: 'id3',
    patientId: 'patient1',
    sequenceName: 'sequenceName',
    status: 'INDEXING',
    samples: [{
      sampleId: 'SA-QWERTY',
      patientId: 'c89e14b7-af05-4c38-865c-a607c295adb2'
    }]
  }, {
    id: 'id4',
    patientId: 'patient1',
    sequenceName: 'sequenceName',
    sequenceId: 'sequence2',
    status: 'ACTIVE',
    samples: [{
      sampleId: 'SA-QWERTY',
      patientId: 'c89e14b7-af05-4c38-865c-a607c295adb2'
    }]
  }];

  const results = await genomicFilter(sets, argv);
  console.log(`${JSON.stringify(results)}`);

  t.deepEqual(results, [{
    id: 'id4',
    patientId: 'patient1',
    sequenceName: 'sequenceName',
    sequenceId: 'sequence2',
    status: 'ACTIVE',
    samples: [{
      sampleId: 'SA-QWERTY',
      patientId: 'c89e14b7-af05-4c38-865c-a607c295adb2'
    }]
  }]);
});
