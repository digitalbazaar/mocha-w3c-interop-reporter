'use strict';

var Mocha = require('mocha');
var uuid = require('uuid');
var Chalk = require('chalk');
var Handlebars = require('handlebars');
var path = require('path');
var fs = require('fs');
var url = require('url');
var util = require('util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Mocha__default = /*#__PURE__*/_interopDefaultLegacy(Mocha);
var Chalk__default = /*#__PURE__*/_interopDefaultLegacy(Chalk);
var Handlebars__default = /*#__PURE__*/_interopDefaultLegacy(Handlebars);

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
const pending = '🛑';
const passing = '✓';
const failing = '❌';
const accessDenied = '⊘';
const timeout = '⏱';
const notImplemented = '—';

const statusMarks = {
  pending,
  passing,
  failing,
  accessDenied,
  timeout,
  notImplemented,
  // mocha's test states aren't in present tense
  passed: passing,
  failed: failing,
};

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Creates white spaces.
 *
 * @param {number} many - How many white spaces?
 *
 * @returns {string} A string contains white spaces.
*/
const spaces = many => new Array(many).join(' ');

/**
 * Counts how many parents a test or suite has.
 *
 * @param {object} test - A mocha test or suite.
 * @param {number} [count=0] - The number of parents counted.
 *
 * @returns {number|Function} Returns a number when it's done
 *   else it returns itself.
*/
const parents = (test, count = 0) => {
  if(!test.parent) {
    return count;
  }
  return parents(test.parent, ++count);
};

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

util.promisify(fs.readdir);
const asyncWriteFile = util.promisify(fs.writeFile);
const asyncReadFile = util.promisify(fs.readFile);

const getPartial = async ({filePath, name}) => {
  const partial = await asyncReadFile(filePath, 'utf8');
  return Handlebars__default["default"].registerPartial(name, partial);
};

// es6 imports and exports don't support __dirname
// so we need to use import.meta.url.
const homeDir = () => {
  // gets the file url of this file
  const dirPath = path.dirname(url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href))));
  const packageName = 'mocha-w3c-interop-reporter';
  if(dirPath.endsWith(packageName)) {
    return dirPath;
  }
  if(dirPath.includes(packageName)) {
    // get the last index for the package
    const lastIndex = dirPath.lastIndexOf(packageName);
    // return everything except the stuff after the packageName
    return dirPath.substring(0, lastIndex + packageName.length);
  }
  // if for some reason this reporter ends up somewhere weird
  // just return the filePath and hope for the best
  return dirPath;
};

const noCircular = (key, value) => {
  const circular = ['ctx', 'parent'];
  if(circular.includes(key)) {
    // replace circular refs with their id or null
    return value.id || null;
  }
  return value;
};

function formatJSON({data, replacer = noCircular}) {
  return JSON.stringify(data, replacer, 2);
}

/**
 * Writes a json file to disc.
 *
 * @param {object} options - Options to use.
 * @param {string} options.path - A path to write to.
 * @param {object} options.data - A JSON Object.
 * @param {Array<string>|Function} [options.replacer=noCircular] -
 *  A JSON replacer usually for circular references.
 *
 * @returns {Promise} Resolves on write.
 */
async function writeJSON({path, data, replacer = noCircular}) {
  return asyncWriteFile(path, formatJSON({data, replacer}));
}

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

// helpersFile is a path to a project specific helpers file.
const registerHelpers = helpersFile => {
  Handlebars__default["default"].registerHelper('getStatusMark',
    state => statusMarks[state] || statusMarks.pending);

  Handlebars__default["default"].registerHelper('formatJSON', data => formatJSON({data}));

  Handlebars__default["default"].registerHelper(
    'getOptional', optional => optional ? 'optional' : 'not-optional');
  try {
    if(!helpersFile) {
      return;
    }
    // We can require additional helpers from a file
    const additionalHelpers = require(helpersFile);
    // the helpers file should export an object with object<string, Function>
    for(const helperName in additionalHelpers) {
      const helperMethod = additionalHelpers[helperName];
      Handlebars__default["default"].registerHelper(helperName, helperMethod);
    }
  } catch(e) {
    console.error(`FAILED TO LOAD HELPERS FILE ${helpersFile}`, e);
  }
};

const makeTemplate = testConfig => {
  registerHelpers(testConfig.helpers);
  const template = Handlebars__default["default"].template;
  const templates = Handlebars__default["default"].templates = Handlebars__default["default"].templates || {};
  //this code was autogenerated by handlebars
  templates['report-template.hbs'] = template(
    {
      compiler: [7, '>= 4.0.0'],
      main: function(container, depth0, helpers, partials, data) {
        let stack1;
        return '<!DOCTYPE html>\n<html>\n  <head>\n' +
      ((stack1 = container.invokePartial(
        partials['head.hbs'], depth0, {
          name: 'head.hbs',
          data,
          indent: '    ',
          helpers,
          partials,
          decorators: container.decorators
        })) != null ? stack1 : '') +
      '  </head>\n  <body>\n' +
      ((stack1 = container.invokePartial(
        partials['body.hbs'], depth0, {
          name: 'body.hbs',
          data,
          indent: '    ',
          helpers,
          partials,
          decorators: container.decorators
        })) != null ? stack1 : '') +
      ((stack1 = container.invokePartial(
        partials['metrics.hbs'], depth0, {
          name: 'metrics.hbs',
          data,
          indent: '    ',
          helpers,
          partials,
          decorators: container.decorators
        })) != null ? stack1 : '') +
      '  </body>\n</html>\n';
      }, usePartial: true, useData: true});
  return templates['report-template.hbs'];
};

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

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
function addSubTests({tests, suites}) {
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
function findReports({suite, reports = new Set()}) {
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
function makeRows({tests, implemented, notImplemented}) {
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
function makeMatrix({
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
function makeTemplateContext({reports}) {
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
function formatStats({passes, tests, failures, pending}) {
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

/**!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
*/

/**
 * Takes in a suite and an object with stats about the test.
 *
 * @param {object} options - Options to use.
 * @param {object} options.suite - The root suite of the tests.
 * @param {object} options.stats - Mocha generated test stats.
 *
 * @returns {Promise<string>} An HTML report.
*/
async function makeReport({suite, stats, config}) {
  const {templates, respecConfig, title} = config;
  const reports = findReports({suite});
  const {summary = new Set()} = suite.suites.find(s => s.summary) || {};
  const context = makeTemplateContext({reports});
  context.respecConfig = await asyncReadFile(respecConfig);
  context.title = title;
  context.stats = stats;
  context.summary = Array.from(summary);
  // go ahead and load these partial templates
  // from disk into handlebars
  await getPartial({filePath: templates.head, name: 'head.hbs'});
  await getPartial({filePath: templates.body, name: 'body.hbs'});
  await getPartial({filePath: templates.metrics, name: 'metrics.hbs'});
  await getPartial({filePath: templates.matrix, name: 'matrix.hbs'});
  const template = makeTemplate(config);
  const result = template(context);
  return result;
}

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

const getConfig = () => {
  const homePath = homeDir();
  const templatesPath = path.join(homePath, 'templates');
  return {
    title: 'W3C Interop Test',
    dirs: {
      // where to output the resulting HTML report
      // if null we output to console.log
      report: null
    },
    // where to log the resulting mocha root suite
    // this can be used to generate test data
    suiteLog: null,
    // config options for the w3c respect library
    respecConfig: path.join(homePath, 'respec.json'),
    // where to find the templates for handlebars
    templates: {
      body: path.join(templatesPath, 'body.hbs'),
      head: path.join(templatesPath, 'head.hbs'),
      metrics: path.join(templatesPath, 'metrics.hbs'),
      table: path.join(templatesPath, 'table.hbs'),
      matrix: path.join(templatesPath, 'matrix.hbs')
    }
  };
};

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN
} = Mocha__default["default"].Runner.constants;

/**
 * Custom Mocha Reporter for w3c test suites.
 *
 * @param {Function} runner - A mocha runner.
 * @param {object} options - The command line options passed to mocha.
 */
function InteropReporter(runner, options = {}) {
  // get the reporterOptions from mocha
  const {reporterOptions} = options;
  // use the default config values as the config
  const config = getConfig();
  const {
    reportDir = config.dirs.report,
    body = config.templates.body,
    matrix = config.templates.matrix,
    head = config.templates.head,
    metrics = config.templates.metrics,
    respec = config.respecConfig,
    helpers = config.helpers,
    suiteLog,
    title = config.title
  } = reporterOptions;
  // reassigned the new values to config
  config.dirs.report = reportDir;
  config.templates.body = body;
  config.respecConfig = respec;
  config.title = title;
  config.helpers = helpers;
  config.templates.matrix = matrix;
  config.templates.head = head;
  config.templates.metrics = metrics;
  // this is a file path for a suite log
  config.suiteLog = suiteLog;
  // set config here
  this.config = config;
  // inherit the base Mocha reporter
  Mocha__default["default"].reporters.Base.call(this, runner, options);
  // add a testId to suite and test
  ['suite', 'test'].forEach(type => {
    runner.on(type, item => {
      item._testId = `urn:uuid:${uuid.v4()}`;
    });
  });
  runner.on(EVENT_SUITE_BEGIN, function(suite) {
    console.log(spaces(parents(suite) * 2), suite.title);
  }).on(EVENT_TEST_PASS, test => {
    console.log(spaces(parents(test) * 2), Chalk__default["default"].green(passing), test.title);
  }).on(EVENT_TEST_FAIL, test => {
    console.log(spaces(parents(test) * 2), Chalk__default["default"].red(failing), test.title);
    console.error(spaces(parents(test) * 2), test.err);
  }).on(EVENT_RUN_END, async function() {
    try {
      console.log('\n');
      const stats = formatStats(this.stats);
      stats.forEach(stat => console.log(stat));
      const reportHTML = await makeReport({
        suite: this.suite,
        stats,
        config
      });
      if(config.suiteLog) {
        writeJSON({path: config.suiteLog, data: this.suite});
      }
      // if there is no report dir return the html
      if(!config.reportDir) {
        return reportHTML;
      }
      await asyncWriteFile(`${config.reportDir}/index.html`, reportHTML);
    } catch(e) {
      console.error(e);
    }
  });
}

module.exports = InteropReporter;
