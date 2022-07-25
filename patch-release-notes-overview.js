const _ = require('lodash')
const getReleaseNote = require('./lib/get-release-note')
const targetOwner = 'livingdocsIO'
const targetRepo = 'documentation'

module.exports = async ({token, owner, repo, sha, tag, test = false, release} = {}) => {
  const path = `data/releases.json`
  const {releaseNote, branchName} = await getReleaseNote({
    owner: targetOwner,
    repo: targetRepo,
    path,
    token,
    releaseName: release.branchName
  })

  // base64 to string
  const originContent = JSON.parse(Buffer.from(releaseNote.content, 'base64').toString('utf8'))
  const patchedContent = _.cloneDeep(originContent)

  if (repo === 'livingdocs-editor') {
    patchedContent[release.branchName].editorVersion = tag
    console.log(`\n\nUpdate Release Notes overview: Set '${release.branchName}.editorVersion' to ${tag}\n\n`)
  }
  if (repo === 'livingdocs-server') {
    patchedContent[release.branchName].serverVersion = tag
    console.log(`\n\nUpdate Release Notes overview: Set '${release.branchName}.serverVersion' to ${tag}\n\n`)
  }

  const patchedBase64ReleaseNotesOverview = Buffer.from(JSON.stringify(patchedContent)).toString('base64')

  return {patchedBase64ReleaseNotesOverview, releaseNotesOverviewSha: releaseNote.sha, releaseNotesOverviewHtml: releaseNote.html_url}
}