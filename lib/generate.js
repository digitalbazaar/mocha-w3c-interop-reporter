/**!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
*/
import {makeTemplate} from './handlebars.js';
import {getJson, getPartial, writeJSON} from './files.js';
import {findReports, makeTemplateData} from './handlers.js';

/**
 * Takes in a suite and an object with stats about the test.
 *
 * @param {object} options - Options to use.
 * @param {object} options.suite - The root suite of the tests.
 * @param {object} options.stats - Mocha generated test stats.
 *
 * @returns {Promise<string>} An HTML report.
*/
export async function makeReport({suite, stats, config}) {
  const {templates, respecConfig, title} = config;
  const reports = findReports({suite});
  const {summary = new Set()} = suite.suites.find(s => s.summary) || {};
  const templateData = makeTemplateData({reports});
  templateData.respecConfig = config.respecConfig = await getJson(respecConfig);
  templateData.title = title;
  templateData.stats = stats;
  templateData.summary = Array.from(summary);
  if(config.templateData) {
    writeJSON({path: config.templateData, data: templateData});
  }
  // go ahead and load these partial templates
  // from disk into handlebars
  await getPartial({filePath: templates.head, name: 'head.hbs'});
  await getPartial({filePath: templates.body, name: 'body.hbs'});
  await getPartial({filePath: templates.error, name: 'error.hbs'});
  await getPartial({filePath: templates.metrics, name: 'metrics.hbs'});
  await getPartial({filePath: templates.matrix, name: 'matrix.hbs'});
  await getPartial({
    filePath: templates.statistics,
    name: 'test-statistics.hbs'
  });
  await getPartial({filePath: templates.abstract, name: 'abstract.hbs'});
  const template = makeTemplate(config);
  const result = template(templateData);
  return result;
}
