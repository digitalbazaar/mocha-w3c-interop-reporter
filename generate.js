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

//masterName is the name of the main report
//used to get the title of all tests for the spec
async function makeReport({fileName, report}) {
  const context = {
    matrices: [],
    tables: []
  };
  const {templates} = testConfig;
  // go ahead and load these partial templates
  // from disk into handlebars
  await getPartial(templates.head);
  await getPartial(templates.body);
  await getPartial(templates.metrics);
  await getPartial(templates.table);
  await getPartial(templates.matrix);
  makeTemplate();
  return context;
}

module.exports = {
  makeReport
};
