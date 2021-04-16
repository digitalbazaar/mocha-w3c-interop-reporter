import {join} from 'path';

module.exports = {
  dirs: {
    report: null
  },
  respecConfig: {
    shortName: 'shortName'
  },
  templates: {
    body: join(__dirname, 'body.hbs'),
    head: join(__dirname, 'head.hbs'),
    metrics: join(__dirname, 'metrics.hbs'),
    table: join(__dirname, 'table.hbs'),
    matrix: join(__dirname, 'matrix.hbs')
  }
};
