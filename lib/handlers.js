/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
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
 * @param {Array<string>} options.implemented - Contains the implementer ids.
 * @param {Array<string>} options.notImplemented - Contains the
 *   nonImplementer ids.
 *
 * @returns {Array<object>} - An array of rows with cells.
*/
export function makeRows({tests, implemented, notImplemented}) {
  const columnIds = [...implemented, ...notImplemented];
  const _rows = tests.reduce((rows, current) => {
    // if we get dirty data ignore it
    if(!current.cell) {
      return rows;
    }
    const {columnId, rowId} = current.cell;
    const columnIndex = columnIds.indexOf(columnId);
    // find the row we are inserting a cell into
    let row = rows.find(f => f.id === rowId);
    // if there is no row add one
    if(!row) {
      row = {id: rowId, cells: []};
      rows.push(row);
    }
    // ensures a cell lines up with its row when rendered
    row.cells[columnIndex] = current;
    return rows;
  }, []);
  return _rows.map(({id, cells}) => {
    for(const colName of notImplemented) {
      const columnIndex = columnIds.indexOf(colName);
      cells[columnIndex] = {
        cell: {
          rowId: id,
          colId: colName
        },
        state: 'notImplemented'
      };
    }
    return {id, cells};
  });
}

/**
 * Makes a matrix from a report.
 *
 * @param {object} options - Options to use.
 * @param {Array<string>} [options.implemented=[]] - Names of implementations
 *   tested.
 * @param {Array<object>} [options.tests=[]] - An array of mocha tests.
 * @param {Array<string} [options.notImplemented=[]] - Names of
 *   implementations not tested.
 *
 * @returns {object} A matrix for a report.
 */
export function makeMatrix({
  implemented = [], tests = [], notImplemented = [], ...suite}) {
  return {
    ...suite,
    columns: [...implemented, ...notImplemented],
    rows: makeRows({tests, implemented, notImplemented})
  };
}

/**
 * Turns a set of Reports into matrices
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
    tables: [],
    summary: []
  };
  for(const report of reports) {
    const tests = addSubTests({tests: report.tests, suites: report.suites});
    report.tests = tests;
    if(report.matrix) {
      context.matrices.push(makeMatrix(report));
    }
    // reports can have summaries
    if(Array.isArray(report.summary)) {
      context.summary = context.summary.concat(report.summary);
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

/**
 * Takes in the the number of success or fails
 * gets a ratio of observation / total.
 *
 * @param {number} observations - Successes or Fails.
 * @param {number} total - Total tests.
 *
 * @returns {number} A percent.
*/
function percent(observations, total) {
  return observations / total * 100;
}

/**
 * Takes in stats computed by mocha and formats them into
 * strings for reports and logs.
 *
 * @param {object} stats - A Mocha stats object.
 * @param {number} stats.passes - The number of passes.
 * @param {number} stats.tests - The total number of tests.
 * @param {number} stats.failures - The number of failures.
 * @param {number} stats.pending - The number of skipped tests.
 *
 * @returns {Array<string>} Human Readable stats.
*/
export function formatStats({passes, tests, failures, pending}) {
  const testsRun = tests - pending;
  let passPercent = percent(passes, testsRun);
  let failPercent = percent(failures, testsRun);
  // if there are more passing than failing then
  // round up the failures
  if(passPercent > failPercent) {
    passPercent = Math.floor(passPercent);
    failPercent = Math.ceil(failPercent);
  }
  // if there are fewer or equal passing round up the passing
  if(passPercent <= failPercent) {
    passPercent = Math.ceil(passPercent);
    failPercent = Math.floor(failPercent);
  }
  return [
    `Tests passed ${passes}/${testsRun} ${passPercent}%`,
    `Tests failed ${failures}/${testsRun} ${failPercent}%`,
    `Tests skipped ${pending}`,
    `Total tests ${tests}`
  ];
}
