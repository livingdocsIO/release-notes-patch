// TODO: make the list dynamic (adapting the current time)
const branches = [
  'release-2018-06',
  'release-2018-09',
  'release-2018-11',
  'release-2019-01',
  'release-2019-02',
  'release-2019-03',
  'release-2019-04',
  'release-2019-05'
]

// @return
// {
//   "branchName": "release-2018-11",
//   "sha": "ac6b118a3ed5d6762e86054b10e99c5c6c8112c7",
//   "message": "my commit message",
// }
// OR false
module.exports = async ({owner, repo, sha, octokit}) => {
  let release = false

  for (const branch of branches) {
    const commit = await octokit.getCommitByRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`
    })
      .catch((e) => e)

    if (commit.data && commit.data.sha === sha) {
      release = {
        branchName: branch,
        sha: commit.data.sha,
        message: commit.data.commit.message
      }
      break
    }
  }

  return release
}