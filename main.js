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
const {asyncWriteFile, writeJSON} = require('./files');
const config = require('./config');
const {formatStats} = require('./handlers');

const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
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
    matrix = config.templates.matrix,
    head = config.templates.head,
    metrics = config.templates.metrics,
    respec = config.respecConfig,
    reportLog,
    title = config.title
  } = reporterOptions;
  this.config.dirs.report = reportDir;
  this.config.templates.body = body;
  this.config.respecConfig = respec;
  this.config.title = title;
  this.config.matrix = matrix;
  this.config.head = head;
  this.config.metrics = metrics;
  // this is a file path for a report log
  this.reportLog = reportLog;
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
  }).on(EVENT_TEST_PASS, test => {
    console.log(spaces(parents(test) * 2), Chalk.green(passing), test.title);
  }).on(EVENT_TEST_FAIL, test => {
    console.log(spaces(parents(test) * 2), Chalk.red(failed), test.title);
    console.error(spaces(parents(test) * 2), test.err);
  }).on(EVENT_RUN_END, async function() {
    try {
      console.log('\n');
      const stats = formatStats(this.stats);
      stats.forEach(stat => console.log(stat));
      const reportHTML = await makeReport({
        suite: this.suite,
        stats
      });
      if(this.reportLog) {
console.log('reportLog found');
        writeJSON(this.reportLog, this.suite);
      }
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
