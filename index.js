const Octokit = require('./lib/octokit')
const getReleaseByCommit = require('./lib/get_release_by_commit')
const getReleaseNote = require('./lib/get_release_note')
const parseReleaseNotes = require('./lib/parse_release_notes')

// main application
module.exports = async ({token, owner, repo, sha, tag}) => {
  const o = new Octokit(token)

  const release = await getReleaseByCommit({owner, repo, sha, octokit: o})
  if (!release) return `release with sha ${sha} in repo ${owner}/${repo} not found`

  const releaseNote = await getReleaseNote({
    owner: 'livingdocsIO',
    repo: 'livingdocs-release-notes',
    path: `releases/${release.branchName}.md`,
    octokit: o
  })

  if (!releaseNote) {
    return `file releases/${release.branchName}.md not found in livingdocs-release-notes`
  }

  const parsedReleaseNotes = parseReleaseNotes({
    owner,
    repo,
    releaseNotesBase64: releaseNote.data.content,
    tag,
    message: release.message
  })

  await o.updateFile({
    owner: 'livingdocsIO',
    repo: 'livingdocs-release-notes',
    path: `releases/${release.branchName}.md`,
    message: `chore: update patch release notes of ${release.branchName}.md with tag ${tag}`,
    content: parsedReleaseNotes,
    sha: releaseNote.data.sha
  })

  return `update of release-notes with tag ${tag} at ${releaseNote.data.html_url} sucessful`
}
