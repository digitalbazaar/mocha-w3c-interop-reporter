#!/usr/bin/env node

/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {argv} from 'node:process';
import {getJson} from '../lib/files.js';
import {makeReport} from '../lib/generate.js';

async function main() {
  console.log('w3c interop reporter make report cli');
  console.log('options: --report=./path/to/report');
  console.log('options: --config=./path/to/config');
  console.log('options: --output=./output.html');
  // first 2 args are always node and file location
  const commands = argv.slice(2);
  // capture the command and path
  const commandParser = /^-{2}(?<command>\D+)=(?<path>.+)$/i;
  // print process commands
  for(const command of commands) {
    console.log({command});
    console.log(commandParser.test(command));
    console.log(commandParser.exec(command));
  }
  const html = await makeReport({
    // no stats
    stats: []
  });
  // print out the html
  console.log(html);
}

main();
