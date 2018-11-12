'use strict';

const crypto = require('crypto');
const { Writable } = require('stream');

module.exports = class FileVerificationStream extends Writable {
  constructor () {
    super({
      write: (chunk, encoding, callback) => {
        this.data = Buffer.concat([this.data || Buffer.from([]), chunk]);
        callback();
      }
    });
  }

  async loadData () {
    return new Promise((resolve, reject) => {
      this.on('finish', () => {
        try {
          this.contentMD5 = crypto.createHash('md5').update(this.data).digest('base64');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }
};
