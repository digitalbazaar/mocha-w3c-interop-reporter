/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

require = require('esm')(module);

const {singleMatrix, multipleMatrices} = require('../mock-data');
const {makeReport} = require('../../generate');
const {asyncWriteFile} = require('../../files');

describe('generate', async function() {
  it('should render a matrix', async function() {
    const report = await makeReport({suite: singleMatrix});
    await asyncWriteFile('./single-report.html', report);
  });
  it('should render multiple matrices', async function() {
    const report = await makeReport({suite: multipleMatrices});
    await asyncWriteFile('./multiple-report.html', report);

  });
});
