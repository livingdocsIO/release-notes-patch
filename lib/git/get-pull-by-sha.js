const request = require('request-promise')

// https://docs.github.com/en/rest/reference/repos#list-pull-requests-associated-with-a-commit
module.exports = async ({owner, repo, token, sha}) => {
  try {
    const pull = await request({
      uri: `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/pulls`,
      headers: {
        'Accept': 'application/vnd.github.groot-preview+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'Request-Promise'
      },
      json: true
    })
    return {
      title: pull[0].title,
      number: pull[0].number,
      htmlUrl: pull[0].htmlUrl
    }
  } catch (error) {
    throw error
  }
}
