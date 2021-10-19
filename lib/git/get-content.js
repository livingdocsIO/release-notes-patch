const axios = require('axios')

// https://docs.github.com/en/rest/reference/repos#get-repository-content
//
// @return
module.exports = async ({
  owner, repo, token, path, branch = 'master'
}) => {
  try {
    const res = await axios({
      url: `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
        'User-Agent': 'release-notes-patch'
      }
    })
    return res.data
  } catch (error) {
    throw error
  }
}
