/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

require = require('esm')(module);

const suite = require('../raw-mocha-finished.json');
const {makeReport} = require('../../generate');
const {asyncWriteFile} = require('../../files');

describe('generate', async function() {
  it('should render a matrix', async function() {
    const report = await makeReport({suite});
    await asyncWriteFile('./report.html', report);
  });
  it('should render multiple matrices', async function() {

  });
});
