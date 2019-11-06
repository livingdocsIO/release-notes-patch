#!/usr/bin/env node
console.log('release-notes-patch v1.1.8')
const argv = require('yargs')
  .demandOption(['token', 'owner', 'repo', 'sha', 'tag'])
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
