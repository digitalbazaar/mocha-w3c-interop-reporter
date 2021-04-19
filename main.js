/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const Mocha = require('mocha');
const uuid = require('uuid');
const Chalk = require('chalk');
const {passing, failed} = require('./constants');
const {spaces, parents} = require('./utils');
const {makeReport} = require('./generate');
const {asyncWriteFile} = require('./files');
const config = require('./config');

const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END
} = Mocha.Runner.constants;

/**
 * Custom Mocha Reporter for w3c test suites.
 *
 * @param {Function} runner - A mocha runner.
 * @param {object} options - The command line options passed to mocha.
 */
function InteropReporter(runner, options = {}) {
  this.config = config;
  const {
    reporterOptions
  } = options;
  const {
    reportDir = config.dirs.report,
    body = config.templates.body,
    respec = config.respecConfig,
    title = config.title
  } = reporterOptions;
  this.config.dirs.report = reportDir;
  this.config.templates.body = body;
  this.config.respecConfig = respec;
  this.config.title = title;
  let rootSuite = null;
  // inherit the base Mocha reporter
  Mocha.reporters.Base.call(this, runner, options);
  // add a testId to suite and test
  ['suite', 'test'].forEach(type => {
    runner.on(type, item => {
      item._testId = `urn:uuid:${uuid.v4()}`;
    });
  });
  runner.on(EVENT_SUITE_BEGIN, function(suite) {
    console.log(spaces(parents(suite) * 2), suite.title);
  }).on(EVENT_SUITE_END, function(suite) {
    if(suite.root) {
      rootSuite = suite;
    }
  }).on(EVENT_TEST_PASS, test => {
    console.log(spaces(parents(test) * 2), Chalk.green(passing), test.title);
  }).on(EVENT_TEST_FAIL, test => {
    console.log(spaces(parents(test) * 2), Chalk.red(failed), test.title);
    console.error(test.err);
  }).on(EVENT_RUN_END, async function() {
    try {
      const reportHTML = await makeReport({suite: rootSuite});
      // if there is no report dir return the html
      if(!reportDir) {
        return reportHTML;
      }
      await asyncWriteFile(`${reportDir}/index.html`, reportHTML);
    } catch(e) {
      console.error(e);
    }
  });
}

exports = module.exports = InteropReporter;
