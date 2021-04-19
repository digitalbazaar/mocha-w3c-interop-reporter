/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

require = require('esm')(module);

const {singleMatrix, multipleMatrices} = require('../mock-data');
const {makeReport} = require('../../generate');
const {shouldBeReport} = require('../assertions');

// FIXME remove this
//const {asyncWriteFile} = require('../../files');

describe('generate', async function() {
  it('should render a matrix', async function() {
    const report = await makeReport({suite: singleMatrix});
    shouldBeReport(report);
    console.log('single report', report);
  });
  it('should render multiple matrices', async function() {
    const report = await makeReport({suite: multipleMatrices});
    shouldBeReport(report);
    console.log('multiple report', report);
  });
});
