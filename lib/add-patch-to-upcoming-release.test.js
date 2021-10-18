const fs = require('fs')
const tap = require('tap')
const addPatchToUpcomingReleaseNote = require('./add-patch-to-upcoming-release-note')
const before = fs.readFileSync('./fixtures/upcoming-release-note-before.md', 'utf8')
const after = fs.readFileSync('./fixtures/upcoming-release-note-after.md', 'utf8')

// default parse case
const parsed = addPatchToUpcomingReleaseNote({
  repo: 'livingdocs-editor',
  releaseNote: before,
  tag: 'v35.24.3',
  pull: {
    title: 'fix: fixed an editor bug',
    number: 99,
    htmlUrl: 'https://github.com/livingdocsIO/livingdocs-editor/pull/99'
  }
})

tap.equal(parsed, after)
