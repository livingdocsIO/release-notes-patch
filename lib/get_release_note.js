// @return
// {
//   "branchName": "release-2018-11",
//   "sha": "ac6b118a3ed5d6762e86054b10e99c5c6c8112c7",
//   "message": "my commit message",
// }
// OR false
module.exports = async ({owner, repo, path, octokit}) => {
  const releaseNote = await octokit.getContent({
    owner,
    repo,
    path
  })
    .catch((e) => {
      throw(new Error(`${path}.md not found at https://github.com/livingdocsIO/livingdocs-release-notes`))
    })

  return releaseNote
}
