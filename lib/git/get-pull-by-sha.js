const axios = require('axios')

// https://docs.github.com/en/rest/reference/repos#list-pull-requests-associated-with-a-commit
module.exports = async ({owner, repo, token, sha}) => {
  try {
    const res = await axios({
      url: `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/pulls`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
        'User-Agent': 'release-notes-patch'
      }
    })

    // when someone pushes to main without opening a PR
    if(res.data.length === 0) return

    return {
      title: res.data[0].title,
      number: res.data[0].number,
      htmlUrl: res.data[0].html_url
    }
  } catch (error) {
    throw error
  }
}
