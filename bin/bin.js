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
  .usage('Usage: $0 <command>')
  .command(
    'makeReport',
    'Turns a mocha suite log into an HTML report',
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
          describe: 'An optional path to write the resulting HTML to',
          demandOption: false
        })
    }
  ).demandCommand().argv;

async function makeReportHandler(commands) {
  const output = commands?.output;
  const config = commands?.config ?
    (getConfig({reporterOptions: await getJson(commands.config)})) :
    getConfig();
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
