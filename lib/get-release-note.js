const getContent = require('./git/get-content')

module.exports = async ({owner, repo, path, token, releaseName}) => {
  let releaseNote
  try {
    releaseNote = await getContent({
      owner,
      repo,
      token,
      path,
      branch: 'master'
    })
    return {releaseNote, branchName: 'master'}
  } catch (error) {
    try {
      releaseNote = await getContent({
        owner,
        repo,
        token,
        path,
        branch: releaseName
      })
      return {releaseNote, branchName: releaseName}
    } catch (err) {
      console.log(err)
      throw new Error(`get-release-note: https://github.com/${owner}/${repo}/${path} not found.`)
    }
  }
}
