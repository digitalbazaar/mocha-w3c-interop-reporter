/*!
 * Copyright (c) 2021-2024 Digital Bazaar, Inc. All rights reserved.
 */
import Handlebars from 'handlebars';
import {join, dirname} from 'path';
import {writeFile, readdir, readFile} from 'fs';
import {fileURLToPath} from 'url';
import {promisify} from 'util';

export const asyncReadDir = promisify(readdir);
export const asyncWriteFile = promisify(writeFile);
export const asyncReadFile = promisify(readFile);

export const getPartial = async ({filePath, name}) => {
  const partial = await asyncReadFile(filePath, 'utf8');
  return Handlebars.registerPartial(name, partial);
};

export const packageRootPath = () => {
  const dirPath = dirname(fileURLToPath(import.meta.url));
  const packageName = 'mocha-w3c-interop-reporter';
  if(dirPath.endsWith(packageName)) {
    return dirPath;
  }
  if(dirPath.includes(packageName)) {
    // get the last index for the package
    const lastIndex = dirPath.lastIndexOf(packageName);
    // return everything except the stuff after the packageName
    return dirPath.substring(0, lastIndex + packageName.length);
  }
  // if for some reason this reporter ends up somewhere weird
  // just return the filePath and hope for the best
  return dirPath;
};

/**
 * Gets a directory.
 *
 * @param {string} path - A path to a data dir.
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

export async function getJson(path) {
  const stringified = await asyncReadFile(path, 'utf8');
  return JSON.parse(stringified);
}

const noCircular = (key, value) => {
  const circular = ['ctx', 'parent'];
  if(circular.includes(key)) {
    // replace circular refs with their id or null
    return value?.id || null;
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
