import {join} from 'path';

module.exports = {
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
  respecConfig: join(__dirname, 'respec.json'),
  // where to find the templates for handlebars
  templates: {
    body: join(__dirname, 'body.hbs'),
    head: join(__dirname, 'head.hbs'),
    metrics: join(__dirname, 'metrics.hbs'),
    table: join(__dirname, 'table.hbs'),
    matrix: join(__dirname, 'matrix.hbs')
  }
};
