/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import Handlebars from 'handlebars';
import {join} from 'path';
import {writeFile, readdir, readFile} from 'fs';
import {promisify} from 'util';

export const asyncReadDir = promisify(readdir);
export const asyncWriteFile = promisify(writeFile);
export const asyncReadFile = promisify(readFile);

export const getPartial = async file => {
  const partial = await readFile(
    join(__dirname, file), 'utf8');
  return Handlebars.registerPartial(file, partial);
};
