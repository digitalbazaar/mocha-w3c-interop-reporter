/**!
 * Copyright (c) 2019-2021 Digital Bazaar, Inc. All rights reserved.
*/
'use strict';

/**
 * Generates the Report using a set of report files.
 */
const testConfig = require('./config.json');
const {makeTemplate} = require('./handlebars');
const {getPartial} = require('./files.js');
const {findReports, makeTemplateContext} = require('./handlers');

async function makeReport({suite}) {
  const {templates, respecConfig} = testConfig;
  const reports = findReports({suite});
  const context = makeTemplateContext({reports});
  context.respecConfig = JSON.stringify(respecConfig);
  // go ahead and load these partial templates
  // from disk into handlebars
  await getPartial({filePath: templates.head, name: 'head.hbs'});
  await getPartial({filePath: templates.body, name: 'body.hbs'});
  await getPartial({filePath: templates.metrics, name: 'metrics.hbs'});
  await getPartial({filePath: templates.matrix, name: 'matrix.hbs'});
  const template = makeTemplate();
  const result = template(context);
  return result;
}

module.exports = {
  makeReport
};
