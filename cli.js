#!/usr/bin/env node
console.log('release-notes-patch -> v1.2.7 (removed octokit)')
const argv = require('yargs')
  .demandOption(['token', 'owner', 'repo', 'sha', 'tag'])
  .help(false)
  .version(false)
  .argv
const run = require('./index')

run(argv)
  .then((message) => {
    console.log(message)
  })
  .catch((e) => {
    console.log(e.message)
    process.exit(1)
  })
