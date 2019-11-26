// @return
// {
//   "branchName": "release-2018-11",
//   "sha": "ac6b118a3ed5d6762e86054b10e99c5c6c8112c7",
//   "message": "my commit message",
// }
// OR false
module.exports = async ({owner, repo, sha, octokit, branches}) => {
  let release = false
  let found = false

  for (const branch of branches) {
    const commit = await octokit.getCommitByRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`
    })
      .catch((e) => {
        return {}
      })

    if (commit.data && commit.data.sha === sha) {
      release = {
        branchName: branch,
        sha: commit.data.sha,
        message: commit.data.commit.message
      }
      found = true
      break
    }
  }

  if (!found) return false
  return release
}
