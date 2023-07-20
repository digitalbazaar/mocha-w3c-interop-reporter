#!/usr/bin/env node

/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {argv} from 'node:process';
import {getConfig} from '../lib/config.js';
import {getJson} from '../lib/files.js';
import {makeReport} from '../lib/generate.js';
import {writeFile} from 'node:fs/promises';

async function main() {
  console.log('w3c interop reporter make report cli');
  console.log('options: --suite=./path/to/suite');
  console.log('options (optional): --config=./path/to/config');
  console.log('options (optional): --output=./output.html');
  // capture the command and path
  const commandParser = /^-{2}(?<command>\D+)=(?<path>.+)$/i;
  const commands = {};
  // first 2 args are always node and file location
  for(const _command of argv.slice(2)) {
    const parsed = commandParser.exec(_command);
    if(!parsed) {
      throw new Error(`invalid command ${_command}`);
    }
    const {groups: {command, path} = {}} = parsed;
    // don't try to open the output file
    if(command === 'output') {
      commands[command] = path;
      continue;
    }
    // open either suite or config
    const json = await getJson(path);
    commands[command] = json;
    continue;
  }
  const html = await makeReport({
    // no stats by default
    stats: [],
    // use default config
    config: getConfig(),
    ...commands
  });
  if(commands.output) {
    await writeFile(commands.output, html);
  } else {
    // print out the html
    console.log(html);
  }
}

main();
