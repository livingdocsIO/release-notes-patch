const fs = require('fs')
const tap = require('tap')
const addPatchToReleaseNote = require('./add-patch-to-release-note')
const before = fs.readFileSync('./fixtures/release-note-before.md', 'utf8')
const after = fs.readFileSync('./fixtures/release-note-after.md', 'utf8')

// default parse case
const parsedEditor = addPatchToReleaseNote({
  owner: 'livingdocsIO',
  repo: 'livingdocs-editor',
  releaseNote: before,
  tag: 'v35.24.3',
  message: 'fix: fixed an editor bug'
})

const parsed = addPatchToReleaseNote({
  owner: 'livingdocsIO',
  repo: 'livingdocs-server',
  releaseNote: parsedEditor,
  tag: 'v75.17.3',
  message: 'fix: fixed a server bug'
})

tap.equal(parsed, after)


// replace server version correctly without a preceding v
const inputWithoutV = `"@livingdocs/server": "75.17.2",`
const expectedWithoutV = `"@livingdocs/server": "v75.17.3",`

const actualWithoutV = addPatchToReleaseNote({
  owner: 'livingdocsIO',
  repo: 'livingdocs-server',
  releaseNote: inputWithoutV,
  tag: 'v75.17.3',
  message: 'fix: fixed an editor bug'
})

tap.equal(actualWithoutV, expectedWithoutV)


// replace server version correctly witha preceding v
const inputWithV = `"@livingdocs/server": "v75.17.2",`
const expectedWithV = `"@livingdocs/server": "v75.17.3",`

const actualWithV = addPatchToReleaseNote({
  owner: 'livingdocsIO',
  repo: 'livingdocs-server',
  releaseNote: inputWithV,
  tag: 'v75.17.3',
  message: 'fix: fixed an editor bug'
})

tap.equal(actualWithV, expectedWithV)
