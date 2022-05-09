/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import Handlebars from 'handlebars';
import {join, dirname} from 'path';
import {writeFile, readdir, readFile, realpath} from 'fs';
import {fileURLToPath} from 'url';
import {promisify} from 'util';

export const asyncReadDir = promisify(readdir);
export const asyncWriteFile = promisify(writeFile);
export const asyncReadFile = promisify(readFile);
export const asyncRealPath = promisify(realpath);

export const getPartial = async ({filePath, name}) => {
  const partial = await asyncReadFile(filePath, 'utf8');
  return Handlebars.registerPartial(name, partial);
};

// es6 imports and exports don't support __dirname
// so we need to use real path.
export const homeDir = async () => {
  // gets the file url of this file
  const fileUrl = fileURLToPath(import.meta.url);
  // get the absolutepath of the file
  const absolutePath = await asyncRealPath(fileUrl);
  // go back one dir to get to home
  const home = join(dirname(absolutePath), '..');
  return home;
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

const noCircular = (key, value) => {
  const circular = ['ctx', 'parent'];
  if(circular.includes(key)) {
    // replace circular refs with their id or null
    return value.id || null;
  }
  return value;
};

export function formatJSON({data, replacer = noCircular}) {
  return JSON.stringify(data, replacer, 2);
}

/**
 * Writes a json file to disc.
 *
 * @param {object} options - Options to use.
 * @param {string} options.path - A path to write to.
 * @param {object} options.data - A JSON Object.
 * @param {Array<string>|Function} [options.replacer=noCircular] -
 *  A JSON replacer usually for circular references.
 *
 * @returns {Promise} Resolves on write.
 */
export async function writeJSON({path, data, replacer = noCircular}) {
  return asyncWriteFile(path, formatJSON({data, replacer}));
}
