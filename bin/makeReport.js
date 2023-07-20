#!/usr/bin/env node

/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {argv} from 'node:process';
import {getConfig} from '../lib/config.js';
import {getJson} from '../lib/files.js';
import {makeReport} from '../lib/generate.js';

async function main() {
  console.log('w3c interop reporter make report cli');
  console.log('options: --suite=./path/to/suite');
  console.log('options: --config=./path/to/config');
  console.log('options: --output=./output.html');
  // capture the command and path
  const commandParser = /^-{2}(?<command>\D+)=(?<path>.+)$/i;
  // first 2 args are always node and file location
  const commands = await argv.slice(2).reduce(async (acc, current) => {
    const parsed = commandParser.exec(current);
    if(!parsed) {
      throw new Error(`invalid command ${current}`);
    }
    const {groups} = parsed;
    const json = await getJson(groups.path);
    acc[groups.command] = json;
    return acc;
  }, {});
  console.log({commands});
  const html = await makeReport({
    // no stats by default
    stats: [],
    // use default config
    config: getConfig(),
    ...commands
  });
  // print out the html
  console.log(html);
}

main();
