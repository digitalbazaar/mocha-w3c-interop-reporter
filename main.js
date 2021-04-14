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
const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END
} = Mocha.Runner.constants;

// WARNING: only compatible with mocha >=  6.0.0
// requires a manual import (see test-mocha.js)
// manual import not required if this is an npm package

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
  // add new fields for the final report here.
  function formatTest(test, parentSuite = '') {
    // remove line breaks and the parentSuite name
    const fullTitle = test
      .fullTitle()
      .replace(/\s\s/g, '')
      .replace(parentSuite, '')
      .trim();
    return {
      // optional means the test is non-normative
      optional: false,
      ...test,
      fullTitle,
      title: test.title.replace(/\s\s/g, ''),
      errors: test.err ? test.err.message : '',
    };
  }
  // recurse through suites collecting all their finished tests.
  function addSubTests(suites, title) {
    suites.forEach(suite => {
      report[title] = report[title].concat(suite.tests);
      if(suite.suites.length) {
        addSubTests(suite.suites, title);
      }
    });
  }
  // add a testId to suite and test
  ['suite', 'test'].forEach(type => {
    runner.on(type, item => {
      item._testId = `urn:uuid:${uuid.v4()}`;
    });
  });
  runner.on(EVENT_SUITE_BEGIN, function(suite) {
    // the rootSuite will setup the report structure.
    if(!suite.parent && suite.suites.length) {
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
    // if a suite is a report then get all the test results for it
    if(suite.report === true) {
      report[suite.title] = report[suite.title].concat(suite.tests);
      // a report can have describe statements in it we need subtests from
      addSubTests(suite.suites, suite.title);
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
      const result = await makeReport({fileName: 'report.html', report});
      console.log('Generated new report.', result);
    } catch(e) {
      console.error(e);
    }
  });
}

exports = module.exports = InteropReporter;
