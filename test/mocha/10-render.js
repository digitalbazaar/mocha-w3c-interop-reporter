/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

require = require('esm')(module);

const {join} = require('path');
const {singleMatrix, multipleMatrices} = require('../mock-data');
const {makeReport} = require('../../generate');
const {shouldBeReport} = require('../assertions');
const {asyncReadFile} = require('../../files');

// FIXME remove this
//const {asyncWriteFile} = require('../../files');

describe('generate', async function() {
  it('should render a matrix', async function() {
    const report = await makeReport({suite: singleMatrix});
    //await asyncWriteFile(join(__dirname, '../single-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(__dirname, '../single-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
  it('should render multiple matrices', async function() {
    const report = await makeReport({suite: multipleMatrices});
    //await asyncWriteFile(join(__dirname, '../multiple-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(__dirname, '../multiple-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
});
