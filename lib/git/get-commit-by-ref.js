const request = require('request-promise')

// https://docs.github.com/en/rest/reference/git#get-a-reference
//
// @return
module.exports = async ({
  owner, repo, token, ref
}) => {
  try {
    return await request({
      method: 'GET',
      uri: `https://api.github.com/repos/${owner}/${repo}/git/ref/${ref}`,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'Request-Promise'
      },
      json: true
    })
  } catch (error) {
    throw error
  }
}
