/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {join} from 'path';
import {homeDir} from './files.js';

export const getConfig = () => {
  const homePath = homeDir();
  const templatesPath = join(homePath, 'templates');
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
    respecConfig: join(homePath, 'respec.json'),
    // where to find the templates for handlebars
    templates: {
      body: join(templatesPath, 'body.hbs'),
      head: join(templatesPath, 'head.hbs'),
      metrics: join(templatesPath, 'metrics.hbs'),
      table: join(templatesPath, 'table.hbs'),
      matrix: join(templatesPath, 'matrix.hbs')
    }
  };
};
