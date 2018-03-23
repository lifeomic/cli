'use strict';

const test = require('ava');
const formatPage = require('../../lib/formatPage');

test(`formatPage should format a paged response`, t => {
  const res = formatPage({
    items: [{ foo: 'bar' }],
    links: {
    }
  });

  t.deepEqual(res, {
    items: [{ foo: 'bar' }]
  });
});

test(`formatPage should format a paged response with next page token`, t => {
  const res = formatPage({
    items: [{ foo: 'bar' }],
    links: {
      next: '/files?nextPageToken=token&pageSize=5'
    }
  });

  t.deepEqual(res, {
    items: [{ foo: 'bar' }],
    nextPageToken: 'token'
  });
});
