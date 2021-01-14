#!/usr/bin/env node

'use strict';

const program = require('commander');

// TODO 完善
program.command('start').action(() => {
  console.log(1)
  require('../lib/development')();
});

program.command('build').action(() => {
  require('../lib/production')();
});

program.arguments('<command>').action(cmd => {
  program.outputHelp();
  console.log();
  console.log(`    ${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

program.parse(process.argv);

function onError(err) {
  console.error(err.message)
  process.exit(1)
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

