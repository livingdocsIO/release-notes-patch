const moment = require('moment')
const getReleaseByCommit = require('./lib/get-release-by-commit')
const getReleaseNote = require('./lib/get-release-note')
const getPullBySha = require('./lib/git/get-pull-by-sha')
const addPatchToReleaseNote = require('./lib/add-patch-to-release-note')
const addPatchToUpcomingReleaseNote = require('./lib/add-patch-to-upcoming-release-note')
const updateContent = require('./lib/git/update-content')
const patchReleaseNotesOverview = require('./patch-release-notes-overview')


const createBranchList = require('./lib/create-branch-list')
const branches = createBranchList({
  time: moment(Date.now()).format('YYYY-MM'),
  months: {before: 8, after: 4}
})
// add 'master' to live patch the upcoming release notes
branches.push('master')

const targetOwner = 'livingdocsIO'
const targetRepo = 'documentation'
const targetBasePath = 'content/operations/releases'


// main application
module.exports = async ({token, owner, repo, sha, tag, test = false} = {}) => {
  const release = await getReleaseByCommit({owner, repo, sha, token, branches})
  if (!release) {
    return `commit ${sha} not found in ${owner}/${repo} in the white listed release branches \n\r${branches.join('\n\r')}`
  }

  // 'content/operations/releases/release-2021-03.md'
  const path = `${targetBasePath}/${release.branchName}.md`
  const {releaseNote, branchName} = await getReleaseNote({
    owner: targetOwner,
    repo: targetRepo,
    path,
    token,
    releaseName: release.branchName
  })

  // base64 to string
  const originReleaseNote = Buffer.from(releaseNote.content, 'base64').toString('utf8')

  let patchedReleaseNotes
  // patch release notes detail for upcoming release
  if (release.branchName === 'master') {
    const pull = await getPullBySha({owner, repo, token, sha})
    patchedReleaseNotes = addPatchToUpcomingReleaseNote({
      repo,
      releaseNote: originReleaseNote,
      tag,
      path,
      pull
    })
  // patch release notes detail of official releases
  } else {
    patchedReleaseNotes = addPatchToReleaseNote({
      owner,
      repo,
      releaseNote: originReleaseNote,
      tag,
      path,
      message: release.message
    })
  }

  const patchedBase64ReleaseNotes = Buffer.from(patchedReleaseNotes).toString('base64')

  const {patchedBase64ReleaseNotesOverview, releaseNotesOverviewSha, releaseNotesOverviewHtml} = await patchReleaseNotesOverview({token, owner, repo, sha, tag, test, release})

  if (test) return `TEST MODE: do not commit changes`

  // update release notes detail
  await updateContent({
    owner: targetOwner,
    repo: targetRepo,
    token,
    path,
    message: `fix(${release.branchName}): add patch to ${release.branchName}.md with tag ${tag}`,
    content: patchedBase64ReleaseNotes,
    sha: releaseNote.sha,
    branch: branchName
  })

  // update release notes overview
  await updateContent({
    owner: targetOwner,
    repo: targetRepo,
    token,
    path: 'data/releases.json',
    message: `fix(${release.branchName}): update release notes overview for ${release.branchName} for ${repo} with tag ${tag}`,
    content: patchedBase64ReleaseNotesOverview,
    sha: releaseNotesOverviewSha,
    branch: branchName
  })

  return `update of release-notes with tag ${tag} at ${releaseNote.html_url} sucessfull\n\n` +
    `update of release-notes overview with tag ${tag} at ${releaseNotesOverviewHtml} sucessfull`
}
