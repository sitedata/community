#!/usr/bin/env node

const {join} = require('path');
const {readFileSync, writeFileSync} = require('fs');

const awsExportsResolved = (() => {
  try {
    return require.resolve(join(__dirname, '../src/aws-exports.js'));
  } catch (e) {
    return false;
  }
})();

const destination = join(__dirname, '../src/credentials.js');
const withGeneratedWarning = body => `
  // this file is generated by '~/scripts/gather-credentials.js', which is
  // triggered with each start / build (any changes to this file will be overriden)

  ${body}
`;

if (awsExportsResolved) {
  const contents = readFileSync(awsExportsResolved, 'utf-8');
  writeFileSync(destination, withGeneratedWarning(contents), 'utf-8');
} else {
  const inject = `module.exports = null;`;
  writeFileSync(destination, withGeneratedWarning(inject), 'utf-8');
}