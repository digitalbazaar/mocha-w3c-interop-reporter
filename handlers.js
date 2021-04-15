/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

/**
 * Recurses through test suites to create one
 * comprehensive array of tests.
 *
 * @param {object} options - Options to use.
 * @param {object} options.report - A report.
 * @param {Array<object>} options.suites - An array of suites.
 * @param {string} options.title - The title of the suite.
 *
 * @returns {object} The report.
*/
export function addSubTests({report, suites, title}) {
  for(const suite of suites) {
    report[title] = report[title].concat(suite.tests);
    if(suite.suites.length) {
      addSubTests({report, suites: suite.suites, title});
    }
  }
  return report;
}

export function formatTest(test, parentSuite = '') {
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
