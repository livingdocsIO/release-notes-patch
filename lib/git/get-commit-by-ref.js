const axios = require('axios')

// https://docs.github.com/en/rest/reference/git#get-a-reference
//
// @return
module.exports = async ({
  owner, repo, token, ref
}) => {
  try {
    const res = await axios({
      url: `https://api.github.com/repos/${owner}/${repo}/git/ref/${ref}`,
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
