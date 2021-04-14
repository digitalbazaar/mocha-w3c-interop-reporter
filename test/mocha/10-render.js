/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

require = require('esm')(module);

const {makeReport} = require('../../generate');

describe('generate', async function() {
  it('should render a table', async function() {
    makeReport({});
  });
  it('should render multiple tables', async function() {

  });
  it('should render a matrix', async function() {

  });
  it('should render multiple matrices', async function() {

  });
});
