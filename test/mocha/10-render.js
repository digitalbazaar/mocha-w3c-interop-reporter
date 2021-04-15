/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

require = require('esm')(module);

const mochaResults = require('../raw-mocha-finished.json');
const {findReports, makeTemplateContext} = require('../../handlers');
const {makeReport} = require('../../generate');

describe('generate', async function() {
  let reports = null;
  before(function() {
    reports = findReports({suite: mochaResults});
    const context = makeTemplateContext({reports});
  });
  it('should render a table', async function() {
    //makeReport({});
    //console.log(reports);
  });
  it('should render multiple tables', async function() {

  });
  it('should render a matrix', async function() {

  });
  it('should render multiple matrices', async function() {

  });
});
