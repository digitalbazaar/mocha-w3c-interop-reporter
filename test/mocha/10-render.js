/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
import {join} from 'path';
import {singleMatrix, multipleMatrices} from '../mock-data.js';
import {makeReport} from '../../lib/generate.js';
import {getConfig} from '../../lib/config.js';
import {shouldBeReport} from '../assertions.js';
import {asyncReadFile, asyncWriteFile, packageRootPath} from
  '../../lib/files.js';

describe('generate', async function() {
  let config;
  let rootPath;
  before(async function() {
    config = await getConfig();
    rootPath = packageRootPath();
  });
  it('should render a matrix', async function() {
    const report = await makeReport({suite: singleMatrix, config});
    await asyncWriteFile(join(rootPath, 'test/single-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(rootPath, 'test/single-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
  it('should render multiple matrices', async function() {
    const report = await makeReport({suite: multipleMatrices, config});
    await asyncWriteFile(join(rootPath, 'test/multiple-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(rootPath, 'test/multiple-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
});
