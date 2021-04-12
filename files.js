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

/**
 * Gets the WHO Data dir used to produce certificates.
 *
 * @param {string} path - A path to the who data dir.
 *
 * @throws {Error} - Throws if the dir is not found or is empty.
 *
 * @returns {Promise<Array<string>>} Dir and file names.
*/
export async function getDir(path) {
  const directory = await asyncReadDir(path);
  if(directory.length <= 0) {
    throw new Error(`Dir ${path} is empty`);
  }
  return directory;
}

/**
 * Gets all files from a directory.
 *
 * @param {string} path - A path to a directory.
 *
 * @returns {Promise<Array<string>>} Gets files as strings.
 */
export async function getDirFiles(path) {
  const dir = await getDir(path);
  const files = await Promise.all(dir.map(
    fileName => asyncReadFile(join(path, fileName), 'utf8')));
  return files;
}

export async function getJSONFiles(path) {
  const strings = await getDirFiles(path);
  return strings.map(JSON.parse);
}
