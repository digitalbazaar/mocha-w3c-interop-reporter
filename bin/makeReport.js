#!/usr/bin/env node

import {argv} from 'node:process';
import {getConfig} from '../lib/config.js';
import {getJson} from '../lib/files.js';
import {makeReport} from '../lib/generate.js';
import {writeFile} from 'node:fs/promises';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

yargs(hideBin(argv))
  .scriptName('interopReporter')
  .command(
    'makeReport',
    'Turns a mocha suite log into a report',
    {
      handler: makeReportHandler,
      builder: _yargs => _yargs
        .option('suiteLog', {
          type: 'string',
          describe: 'A path to a mocha suite log',
          demandOption: true
        })
        .option('config', {
          type: 'string',
          describe: 'An optional path to an interop reporter config file',
          demandOption: false
        })
        .option('output', {
          type: 'string',
          describe: 'An optional path to write the resulting HTML to.',
          demandOption: false
        })
    }
  ).parse();

async function makeReportHandler(commands) {
  const config = commands?.config ?
    (await getJson(commands.config)) : getConfig();
  const output = commands?.output ?
    (await getJson(commands.ouput)) : false;
  const suite = commands?.suiteLog ?
    (await getJson(commands.suiteLog)) : false;
  const html = await makeReport({
    // no stats by default
    stats: [],
    // use default config
    config,
    suite
  });
  if(output) {
    await writeFile(output, html);
  } else {
    // print out the html
    console.log(html);
  }
}
