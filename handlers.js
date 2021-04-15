/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

/**
 * Recurses through test suites to create one
 * comprehensive array of tests.
 *
 * @param {object} options - Options to use.
 * @param {Array<object>} options.tests - An array of tests.
 * @param {Array<object>} options.suites - An array of suites.
 *
 * @returns {object} The report.
*/
export function addSubTests({tests, suites}) {
  for(const suite of suites) {
    tests = tests.concat(suite.tests);
    if(suite.suites.length) {
      addSubTests({tests, suites: suite.suites});
    }
  }
  return tests;
}

/**
 * Given an initial suite finds all reports.
 *
 * @param {object} options - Options to use.
 * @param {object} options.suite - Usually the initial suite.
 * @param {Set} [options.reports= new Set()] - A set to store the reports in.
 *
 * @returns {Set} The resulting reports.
*/
export function findReports({suite, reports = new Set()}) {
  for(const _suite of suite.suites) {
    if(_suite.report === true) {
      if(!reports.has(_suite)) {
        reports.add(_suite);
      }
    }
    findReports({suite: _suite, reports});
  }
  return reports;
}

/**
 * Turns an Array of tests into rows and cells.
 *
 * @param {object} options - Options to use.
 * @param {Array<object>} options.tests - An array of tests.
 * @param {Array<string>} options.columns - An array of strings.
 *
 * @returns {Array<object>} - An array of rows with cells.
*/
export function makeRows({tests, columns}) {
  return tests.reduce((rows, current) => {
    // if we get dirty data ignore it
    if(!current.cell) {
      return rows;
    }
    const [rowId, columnId] = current.cell;
    const columnIndex = columns.indexOf(columnId);
    let row = rows.find(f => f.id === rowId);
    if(!row) {
      row = {id: rowId, cells: []};
      rows.push(row);
    }
    // ensures a cell lines up with its row when rendered
    row.cells[columnIndex] = current;
    return rows;
  }, []);
}

export function makeMatrix({columns = [], tests = []}) {
  return {
    columns,
    rows: makeRows({tests, columns})
  };
}

/**
 * Turns a set of Reports into either matrixies or tables
 * that can be templated into html reports.
 *
 * @param {object} options - Options to use.
 * @param {Set} options.reports - A set of mocha suites that are reports.
 *
 * @returns {object} - Returns an object with matrices & tables for the
 *  template.
*/
export function makeTemplateContext({reports}) {
  const context = {
    matrices: [],
    tables: []
  };
  for(const report of reports) {
    const tests = addSubTests({tests: report.tests, suites: report.suites});
    report.tests = tests;
    if(report.matrix) {
      context.matrices.push(makeMatrix(report));
    }
  }
  return context;
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
