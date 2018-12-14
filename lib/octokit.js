const octokit = require('@octokit/rest')()

module.exports = class Octokit {

  constructor (token) {
    if (token) {
      octokit.authenticate({
        type: 'oauth',
        token: token
      })
    }
  }

  // @param {String} ref The name of the branch/tag
  // e.g.
  //   ref: `refs/heads/release-2018-11`
  //   ref: `refs/tags/v35.0.0`
  async getCommitByRef ({owner, repo, ref}) {
    return octokit.repos.getCommitRefSha({
      owner,
      repo,
      ref
    })
  }

  // @param {String} ref The name of the branch/tag
  // @param {String} path of the file name
  // e.g.
  //   ref: `refs/heads/release-2018-11`
  //   ref: `refs/tags/v35.0.0`
  async getContent ({owner, repo, path}) {
    return octokit.repos.getContents({
      owner,
      repo,
      path,
      // The name of the commit/branch/tag.
      ref: 'master'
    })
  }

  // path: path of the file name
  // content: new file content base64 encoded
  // sha: blob SHA of the file being replaced
  async updateFile ({owner, repo, path, message, content, sha}) {
    return octokit.repos.updateFile({
      owner,
      repo,
      path,
      message,
      content,
      sha,
      branch: 'master'
    })
  }
}
