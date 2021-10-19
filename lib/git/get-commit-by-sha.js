const axios = require('axios')

// https://docs.github.com/en/rest/reference/git#get-a-commit
//
// @return
module.exports = async ({
  owner, repo, token, sha
}) => {
  try {
    const res = await axios({
      url: `https://api.github.com/repos/${owner}/${repo}/git/commits/${sha}`,
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
