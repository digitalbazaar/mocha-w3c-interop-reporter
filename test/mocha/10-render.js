/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {join} from 'path';
import {highlightMatrix, singleMatrix, multipleMatrices} from '../mock-data.js';
import {makeReport} from '../../lib/generate.js';
import {getConfig} from '../../lib/config.js';
import {shouldBeReport} from '../assertions.js';
import {asyncReadFile, asyncWriteFile, packageRootPath} from
  '../../lib/files.js';

const stats = [
  'Tests passed 32/42 76%',
  'Tests failed 10/42 24%',
  'Tests skipped 0',
  'Total tests 42'
];

describe('generate', async function() {
  let config;
  let rootPath;
  before(async function() {
    config = await getConfig();
    rootPath = packageRootPath();
  });
  it('should render a matrix', async function() {
    const report = await makeReport({
      suite: singleMatrix,
      stats,
      config: {...config}
    });
    await asyncWriteFile(join(rootPath, 'test/single-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(rootPath, 'test/single-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
  it('should render multiple matrices', async function() {
    const report = await makeReport({
      suite: multipleMatrices,
      stats,
      config: {...config}
    });
    await asyncWriteFile(join(rootPath, 'test/multiple-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(rootPath, 'test/multiple-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
  it('should highlight rows with less than 2 passes', async function() {
    const report = await makeReport({
      suite: highlightMatrix,
      stats,
      config: {...config}
    });
    await asyncWriteFile(join(rootPath, 'test/highlight-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(rootPath, 'test/highlight-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
  it('should require helpers from reporter-options', async function() {
    const report = await makeReport({
      suite: highlightMatrix,
      stats,
      config: {
        ...config,
        ...{helpers: join(rootPath, 'test/projectHelpers.js')}
      }
    });
    await asyncWriteFile(join(rootPath, 'test/highlight-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(rootPath, 'test/highlight-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
});
