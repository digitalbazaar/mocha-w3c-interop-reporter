/*!
 * Copyright (c) 2021-2024 Digital Bazaar, Inc. All rights reserved.
 */
import Mocha from 'mocha';
import {v4 as uuidv4} from 'uuid';
import pc from 'picocolors';
import {passing, failing} from './statusMarks.js';
import {spaces, parents} from './utils.js';
import {makeReport} from './generate.js';
import {asyncWriteFile, writeJSON} from './files.js';
import {getConfig} from './config.js';
import {formatStats} from './handlers';

const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN
} = Mocha.Runner.constants;

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
  const config = getConfig({reporterOptions});
  const {reportDir} = reporterOptions;
  // set config here
  this.config = config;
  // inherit the base Mocha reporter
  Mocha.reporters.Base.call(this, runner, options);
  // add a testId to suite and test
  ['suite', 'test'].forEach(type => {
    runner.on(type, item => {
      item._testId = `urn:uuid:${uuidv4()}`;
    });
  });
  runner.on(EVENT_SUITE_BEGIN, function(suite) {
    console.log(spaces(parents(suite) * 2), suite.title);
  }).on(EVENT_TEST_PASS, test => {
    console.log(spaces(parents(test) * 2), pc.green(passing), test.title);
  }).on(EVENT_TEST_FAIL, test => {
    console.log(spaces(parents(test) * 2), pc.red(failing), test.title);
    console.error(spaces(parents(test) * 2), test.err);
  }).on(EVENT_RUN_END, async function() {
    try {
      console.log('\n');
      const stats = formatStats(this.stats);
      if(config.stats) {
        stats.forEach(stat => console.log(stat));
      }
      const reportHTML = await makeReport({
        suite: this.suite,
        stats: config.stats ? stats : [],
        config
      });
      if(config.suiteLog) {
        writeJSON({path: config.suiteLog, data: this.suite});
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

export {setupMatrix} from './helpers.js';
export default InteropReporter;
