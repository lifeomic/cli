'use strict';

const querystring = require('querystring');
const url = require('url');

module.exports = page => {
  const p = { items: page.items };
  if (page.links && page.links.next) {
    const parsed = url.parse(page.links.next);
    p.nextPageToken = querystring.parse(parsed.query).nextPageToken;
  }

  return p;
};
