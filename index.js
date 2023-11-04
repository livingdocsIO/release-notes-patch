const moment = require('moment')
const getReleaseByCommit = require('./lib/get-release-by-commit')
const getReleaseNote = require('./lib/get-release-note')
const getPullBySha = require('./lib/git/get-pull-by-sha')
const addPatchToReleaseNote = require('./lib/add-patch-to-release-note')
const addPatchToUpcomingReleaseNote = require('./lib/add-patch-to-upcoming-release-note')
const updateContent = require('./lib/git/update-content')
const patchReleaseNotesOverview = require('./patch-release-notes-overview')
const getReleaseNotesOverview = require('./get-release-notes-overview')


const createBranchList = require('./lib/create-branch-list')
const branches = createBranchList({
  time: moment(Date.now()).format('YYYY-MM'),
  months: {before: 8, after: 4}
})
// add 'main' to live patch the upcoming release notes
// add 'master' to live patch the upcoming release notes
branches.push('main')
branches.push('master')

const targetOwner = 'livingdocsIO'
const targetRepo = 'documentation'


// main application
module.exports = async ({token, owner, repo, sha, tag, test = false} = {}) => {
  const release = await getReleaseByCommit({owner, repo, sha, token, branches})
  if (!release) {
    return `commit ${sha} not found in ${owner}/${repo} in the white listed release branches \n\r${branches.join('\n\r')}`
  }

  // get release notes overview from documentation repo (data/releases.json)
  //   path = 'content/operations/releases/release-2021-03.md'
  const releaseNotesOverview = await getReleaseNotesOverview({token})
  const path = `content${releaseNotesOverview[release.branchName].ref}`
  const releaseNote = await getReleaseNote({owner: targetOwner, repo: targetRepo, path, token})

  // base64 to string
  const originReleaseNote = Buffer.from(releaseNote.content, 'base64').toString('utf8')

  let patchedReleaseNotes
  // patch release notes detail for upcoming release
  if (release.branchName === 'master' || release.branchName === 'main') {
    const pull = await getPullBySha({owner, repo, token, sha})
    if (!pull) return `Release notes will not be extended, because no PR found for commit ${sha} in ${owner}/${repo}. \nThis happens when someone pushes to main without opening a PR.`
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

  const {patchedBase64ReleaseNotesOverview, releaseNotesOverviewSha, releaseNotesOverviewHtml} = await patchReleaseNotesOverview({token, repo, tag, release})

  if (test) return `TEST MODE: do not commit changes`

  // update release notes detail
  await updateContent({
    owner: targetOwner,
    repo: targetRepo,
    token,
    path,
    message: `fix(${release.branchName}): add patch to ${release.branchName}.md with tag ${tag}`,
    content: patchedBase64ReleaseNotes,
    sha: releaseNote.sha
  })

  // update release notes overview
  await updateContent({
    owner: targetOwner,
    repo: targetRepo,
    token,
    path: 'data/releases.json',
    message: `fix(${release.branchName}): update release notes overview for ${release.branchName} for ${repo} with tag ${tag}`,
    content: patchedBase64ReleaseNotesOverview,
    sha: releaseNotesOverviewSha
  })

  return `update of release-notes with tag ${tag} at ${releaseNote.html_url} sucessfull\n\n` +
    `update of release-notes overview with tag ${tag} at ${releaseNotesOverviewHtml} sucessfull`
}
