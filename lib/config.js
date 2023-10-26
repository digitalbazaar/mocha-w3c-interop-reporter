/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {join} from 'path';
import {packageRootPath} from './files.js';

export const getConfig = ({reporterOptions = {}} = {}) => {
  const rootPath = packageRootPath();
  const templatesPath = join(rootPath, 'templates');
  return {
    helpers: reporterOptions.helpers || null,
    title: reporterOptions.title || 'W3C Interop Test',
    dirs: {
      // where to output the resulting HTML report
      // if null we output to console.log
      report: reporterOptions.reportDir || null
    },
    // where to log the resulting mocha root suite
    // this can be used to generate test data
    suiteLog: reporterOptions.suiteLog || null,
    // config options for the w3c respect library
    respecConfig: reporterOptions.respec || join(rootPath, 'respec.json'),
    reportContext: reporterOptions.reportContext || null,
    // where to find the templates for handlebars
    templates: {
      abstract: reporterOptions.abstract ||
        join(templatesPath, 'abstract.hbs'),
      body: reporterOptions.body ||
        join(templatesPath, 'body.hbs'),
      error: reporterOptions.error ||
        join(templatesPath, 'error.hbs'),
      head: reporterOptions.head ||
        join(templatesPath, 'head.hbs'),
      metrics: reporterOptions.metrics ||
        join(templatesPath, 'metrics.hbs'),
      table: reporterOptions.table ||
        join(templatesPath, 'table.hbs'),
      matrix: reporterOptions.matrix ||
        join(templatesPath, 'matrix.hbs'),
      statistics: reporterOptions.statistics ||
        join(templatesPath, 'test-statistics.hbs'),
    }
  };
};
