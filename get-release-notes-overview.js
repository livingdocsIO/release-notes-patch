const _ = require('lodash')
const getReleaseNote = require('./lib/get-release-note')
const targetOwner = 'livingdocsIO'
const targetRepo = 'documentation'

module.exports = async ({token} = {}) => {
  const path = `data/releases.json`
  const releaseNote = await getReleaseNote({owner: targetOwner, repo: targetRepo, path, token})

  // base64 to string
  const originContent = JSON.parse(Buffer.from(releaseNote.content, 'base64').toString('utf8'))
  return originContent
}
