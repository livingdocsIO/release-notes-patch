// @return {String} base64 encoded and parsed releaseNotes
module.exports = ({owner, repo, releaseNotesBase64, tag, message}) => {
  // init
  let repoType = ''
  if (repo === 'livingdocs-server') repoType = 'server'
  if (repo === 'livingdocs-editor') repoType = 'editor'
  let lastLine = ''
  let parsedReleaseNotes = ''

  // base64 to string
  const originReleaseNotes = Buffer.from(releaseNotesBase64, 'base64').toString('utf8')

  // do nothing when tag info already exists in release notes
  if (originReleaseNotes.includes(tag)) return false

  // parsing
  originReleaseNotes.split(/\r?\n/).forEach((originLine) => {
    let line = originLine

    // update tag of the introduction in the release-notes
    if (line.includes(repoType)) {
      line = line.replace(/`([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})`/i, `\`${tag}\``)
      line = line.replace(/"([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})"/i, `"${tag}"`)
    }

    // add new patch to the patches section
    if (RegExp(`livingdocs ${repoType} patches`, 'ig').test(lastLine)) {
      const newNote = `- [${tag}](https://github.com/${owner}/${repo}/releases/tag/${tag}): ${message}`
      line = `\n${newNote}${line}`
    }

    parsedReleaseNotes = `${parsedReleaseNotes}\n${line}`
    lastLine = line
  })

  return Buffer.from(parsedReleaseNotes).toString('base64')
}
