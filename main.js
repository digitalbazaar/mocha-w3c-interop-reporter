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
const {formatTest} = require('./handlers');
const {writeJSON} = require('./files');

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
function InteropReporter(runner, options) {
  // inherit the base Mocha reporter
  Mocha.reporters.Base.call(this, runner, options);
  const report = {};
  const reports = new Set();
  // add a testId to suite and test
  ['suite', 'test'].forEach(type => {
    runner.on(type, item => {
      item._testId = `urn:uuid:${uuid.v4()}`;
    });
  });
  runner.on(EVENT_SUITE_BEGIN, function(suite) {
    // the rootSuite will setup the report structure.
    if(suite.root && suite.suites.length) {
      const [rootSuite] = suite.suites;
      rootSuite.suites.forEach(s => {
        report[s.title] = [];
      });
    }
    if(!suite.title) {
      return;
    }
    console.log(spaces(parents(suite) * 2), suite.title);
  }).on(EVENT_SUITE_END, function(suite) {
/* FIXME do not include in release
    if(suite.root) {
      writeJSON({path: './report.log', data: suite}).then(console.log, console.error);
    }
*/
    // if a suite is a report then get all the test results for it
    if(suite.report === true) {
      // FIXME this is what we want, but don't have yet
      reports.add(suite);
      report[suite.title] = report[suite.title].concat(suite.tests);
      // a report can have describe statements in it we need subtests from
    }
  }).on(EVENT_TEST_PASS, test => {
    console.log(spaces(parents(test) * 2), Chalk.green(passing), test.title);
  }).on(EVENT_TEST_FAIL, test => {
    console.log(spaces(parents(test) * 2), Chalk.red(failed), test.title);
  }).on(EVENT_RUN_END, async function() {
    try {
      Object.keys(report).forEach(name => {
        // create a function for each test under this name
        const formatter = test => formatTest(test, name);
        // move all optional tests to the bottom
        report[name] = report[name]
          .map(formatter)
          .sort((a, b) => a.optional - b.optional);
      });
      console.log('reports on', Object.keys(report));
      console.log('set of', reports);
      const result = await makeReport({fileName: 'report.html', report});
      console.log('Generated new report.', result);
    } catch(e) {
      console.error(e);
    }
  });
}

exports = module.exports = InteropReporter;
