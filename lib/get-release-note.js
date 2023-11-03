const getContent = require('./git/get-content')

module.exports = async ({owner, repo, path, token}) => {
  try {
    return await getContent({
      owner,
      repo,
      token,
      path,
      branch: 'main'
    })
  } catch (error) {
    console.log(err)
    throw new Error(`get-release-note: https://github.com/${owner}/${repo}/${path} not found.`)
  }
}
