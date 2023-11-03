const axios = require('axios')

// https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
module.exports = async ({
  owner, repo, token, path, message, content, sha, branch = 'main'
}) => {
  const res = await axios({
    method: 'put',
    url: `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    data: {message, content, sha, branch},
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
      'User-Agent': 'release-notes-patch'
    }
  })
  return res.data
}
