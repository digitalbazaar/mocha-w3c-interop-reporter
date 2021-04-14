/**!
 * Copyright (c) 2019-2021 Digital Bazaar, Inc. All rights reserved.
*/
'use strict';

/**
 * Generates the Report using a set of report files.
 */
const testConfig = require('./config.json');
const {makeTemplate} = require('./handlebars');
const {writeJSON, getPartial} = require('./files.js');

//masterName is the name of the main report
//used to get the title of all tests for the spec
async function makeReport({fileName, report}) {
  const {templates, respecConfig} = testConfig;
  const context = {
    matrices: [],
    tables: [
      {title: 'one', columnNames: ['col one'], tests: [{state: 'passed', optional: false}]},
      {title: 'two', columnNames: ['one'], tests: []}
    ],
    respecConfig: JSON.stringify(respecConfig)
  };
  for(const key in report) {
    const suite = report[key];
    console.log(Object.keys(suite));
    console.log(Object.keys(suite[0]));
  }
  // go ahead and load these partial templates
  // from disk into handlebars
  await getPartial({filePath: templates.head, name: 'head.hbs'});
  await getPartial({filePath: templates.body, name: 'body.hbs'});
  await getPartial({filePath: templates.metrics, name: 'metrics.hbs'});
  await getPartial({filePath: templates.table, name: 'table.hbs'});
  await getPartial({filePath: templates.matrix, name: 'matrix.hbs'});
  const template = makeTemplate();
  const result = template(context);
console.log(result);
  return context;
}

module.exports = {
  makeReport
};
