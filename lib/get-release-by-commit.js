const getCommitByRef = require('./git/get-commit-by-ref')
const getCommitBySha = require('./git/get-commit-by-sha')

// @return
// {
//   "branchName": "release-2018-11",
//   "sha": "ac6b118a3ed5d6762e86054b10e99c5c6c8112c7",
//   "message": "my commit message",
// }
// OR false
module.exports = async ({owner, repo, sha, token, branches}) => {
  let release = false
  let found = false

  for (const branch of branches) {
    // only loads latest commit from a branch
    const commit = await getCommitByRef({
      owner,
      repo,
      token,
      ref: `heads/${branch}`
    })
      .catch((e) => {
        return {}
      })

    if (commit && commit.object && commit.object.sha) {
      const commitBySha = await getCommitBySha({
        owner,
        repo,
        token,
        sha: commit.object.sha
      })
        .catch((e) => {
          return {}
        })

      if (commitBySha.sha === sha) {
        release = {
          branchName: branch,
          sha: commitBySha.sha,
          message: commitBySha.message
        }
        found = true
        break
      }
    }
  }

  if (!found) return false
  return release
}
