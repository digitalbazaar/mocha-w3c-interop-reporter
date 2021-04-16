import {join} from 'path';

module.exports = {
  title: 'W3C Interop Test',
  dirs: {
    report: null
  },
  respecConfig: join(__dirname, 'respec.json'),
  templates: {
    body: join(__dirname, 'body.hbs'),
    head: join(__dirname, 'head.hbs'),
    metrics: join(__dirname, 'metrics.hbs'),
    table: join(__dirname, 'table.hbs'),
    matrix: join(__dirname, 'matrix.hbs')
  }
};
