/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {join, dirname} from 'path';

// es6 imports and exports don't support __dirname
// so we need to use process command working dir.
const homeDir = () => dirname(process.cwd());

export const config = {
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
  respecConfig: join(homeDir(), 'respec.json'),
  // where to find the templates for handlebars
  templates: {
    body: join(homeDir(), 'templates', 'body.hbs'),
    head: join(homeDir(), 'templates', 'head.hbs'),
    metrics: join(homeDir(), 'templates', 'metrics.hbs'),
    table: join(homeDir(), 'templates', 'table.hbs'),
    matrix: join(homeDir(), 'templates', 'matrix.hbs')
  }
};
