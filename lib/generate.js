/**!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
*/
'use strict';

/**
 * Generates the Report using a set of report files.
 */
import {config} from './config.js';
import {makeTemplate} from './handlebars.js';
import {asyncReadFile, getPartial} from './files.js';
import {findReports, makeTemplateContext} from './handlers.js';

/**
 * Takes in a suite and an object with stats about the test.
 *
 * @param {object} options - Options to use.
 * @param {object} options.suite - The root suite of the tests.
 * @param {object} options.stats - Mocha generated test stats.
 *
 * @returns {Promise<string>} An HTML report.
*/
export async function makeReport({suite, stats}) {
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
