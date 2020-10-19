var request = require('request-promise');

// https://docs.github.com/en/rest/reference/repos#get-repository-content
//
// @return
module.exports = async ({
  owner, repo, token, path, branch='master'
}) => {
  try {
    return await request({
      method: 'GET',
      uri: `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'Request-Promise',
      },
      json: true
    })
  } catch (error) {
    throw error
  }
}