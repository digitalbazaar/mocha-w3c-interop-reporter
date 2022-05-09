/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {join} from 'path';
import {singleMatrix, multipleMatrices} from '../mock-data.js';
import {makeReport} from '../../lib/generate.js';
import {getConfig} from '../../lib/config.js';
import {shouldBeReport} from '../assertions.js';
import {asyncReadFile, asyncWriteFile} from '../../lib/files.js';

describe('generate', async function() {
  let config;
  before(async function() {
    config = await getConfig();
  });
  it('should render a matrix', async function() {
    const report = await makeReport({suite: singleMatrix, config});
    await asyncWriteFile(join(process.cwd(), '../single-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(process.cwd(), '../single-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
  it('should render multiple matrices', async function() {
    const report = await makeReport({suite: multipleMatrices, config});
    await asyncWriteFile(join(process.cwd(), '../multiple-report.html'), report);
    const expectedReport = await asyncReadFile(
      join(process.cwd(), '../multiple-report.html'));
    shouldBeReport(report, expectedReport.toString());
  });
});
