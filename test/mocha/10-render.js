/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

require = require('esm')(module);

const suite = require('../raw-mocha-finished.json');
const {makeReport} = require('../../generate');

describe('generate', async function() {
  it('should render a matrix', async function() {
    const report = await makeReport({suite});
console.log(report);
  });
  it('should render multiple matrices', async function() {

  });
});
