const request = require('request-promise')

// https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
module.exports = async ({
  owner, repo, token, path, message, content, sha, branch = 'master'
}) => {
  return await request({
    method: 'PUT',
    uri: `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    body: {message, content, sha, branch},
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
      'User-Agent': 'Request-Promise'
    },
    json: true
  })
}
