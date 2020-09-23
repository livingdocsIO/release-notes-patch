const getContent = require('./git/get_content')

module.exports = async ({owner, repo, path, token}) => {
  try {
    const releaseNote = await getContent({
      owner,
      repo,
      token,
      path
    })
    return releaseNote

  } catch (error) {
    console.log(error)
    throw new Error(`${path} not found at https://github.com/livingdocsIO/livingdocs-release-notes`)
  }
}
