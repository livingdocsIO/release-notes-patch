const Octokit = require('./lib/octokit')
const getReleaseByCommit = require('./lib/get_release_by_commit')
const getReleaseNote = require('./lib/get_release_note')
const parseReleaseNotes = require('./lib/parse_release_notes')

// TODO: make the list dynamic (adapting the current time)
const branches = [
  'release-2019-01',
  'release-2019-03',
  'release-2019-05',
  'release-2019-07',
  'release-2019-09',
  'release-2019-12',
  'release-2020-01',
  'release-2020-02',
  'release-2020-03',
  'release-2020-04',
  'release-2020-05',
  'release-2020-06',
  'release-2020-07',
  'release-2020-08',
  'release-2020-09',
  'release-2020-10',
  'release-2020-11',
  'release-2020-12'
]

// main application
module.exports = async ({token, owner, repo, sha, tag} = {}) => {
  const o = new Octokit(token)

  const release = await getReleaseByCommit({owner, repo, sha, octokit: o, branches})
  if (!release) {
    return `commit ${sha} not found in ${owner}/${repo} in the white listed release branches \n\r${branches.join('\n\r')}`
  }

  const path = `releases/${release.branchName}.md`
  const releaseNote = await getReleaseNote({
    owner: 'livingdocsIO',
    repo: 'livingdocs-release-notes',
    path: path,
    octokit: o
  })

  // base64 to string
  const originReleaseNote = Buffer.from(releaseNote.data.content, 'base64').toString('utf8')

  const parsedReleaseNote = parseReleaseNotes({
    owner,
    repo,
    releaseNote: originReleaseNote,
    tag,
    path,
    message: release.message
  })

  const parsedBase64ReleaseNote = Buffer.from(parsedReleaseNote).toString('base64')

  await o.updateFile({
    owner: 'livingdocsIO',
    repo: 'livingdocs-release-notes',
    path: path,
    message: `chore: update patch release notes of ${release.branchName}.md with tag ${tag}`,
    content: parsedBase64ReleaseNote,
    sha: releaseNote.data.sha
  })

  return `update of release-notes with tag ${tag} at ${releaseNote.data.html_url} sucessful`
}
