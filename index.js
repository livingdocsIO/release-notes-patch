const Octokit = require('./lib/octokit')
const getReleaseByCommit = require('./lib/get_release_by_commit')
const getReleaseNote = require('./lib/get_release_note')
const parseReleaseNotes = require('./lib/parse_release_notes')

// main application
module.exports = async ({token, owner, repo, sha, tag}) => {
  const o = new Octokit(token)

  const release = await getReleaseByCommit({owner, repo, sha, octokit: o})

  const releaseNote = await getReleaseNote({
    owner: 'livingdocsIO',
    repo: 'livingdocs-release-notes',
    path: `releases/${release.branchName}.md`,
    octokit: o
  })

  // base64 to string
  const originReleaseNote = Buffer.from(releaseNote.data.content, 'base64').toString('utf8')

  const parsedReleaseNote = parseReleaseNotes({
    owner,
    repo,
    releaseNote: originReleaseNote,
    tag,
    message: release.message
  })

  const parsedBase64ReleaseNote = Buffer.from(parsedReleaseNote).toString('base64')

  if (!parsedBase64ReleaseNote) {
    throw(new Error(`livingdocs-release-notes are not updated, because ${tag} is already in releases/${release.branchName}.md`))
  }
  
  await o.updateFile({
    owner: 'livingdocsIO',
    repo: 'livingdocs-release-notes',
    path: `releases/${release.branchName}.md`,
    message: `chore: update patch release notes of ${release.branchName}.md with tag ${tag}`,
    content: parsedBase64ReleaseNote,
    sha: releaseNote.data.sha
  })

  return `update of release-notes with tag ${tag} at ${releaseNote.data.html_url} sucessful`
}
