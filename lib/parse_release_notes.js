// @return {String} base64 encoded and parsed releaseNotes
module.exports = ({owner, repo, releaseNote, tag, path, message}) => {
  // init
  let repoType = ''
  if (repo === 'livingdocs-server') repoType = 'server'
  if (repo === 'livingdocs-editor') repoType = 'editor'
  let lastLine
  let parsedReleaseNote = ''
  const originReleaseNotes = releaseNote

  // do nothing when tag info already exists in release notes
  if (originReleaseNotes.includes(tag)) {
    throw (new Error(`https://github.com/livingdocsIO/livingdocs-release-notes/blob/master/${path} will not be updated, because ${tag} is already documented`))
  }

  // parsing
  originReleaseNotes.split(/\r?\n/).forEach((originLine) => {
    let line = originLine

    // update tag of the introduction in the release-notes
    if (line.includes(repoType)) {
      line = line.replace(/`[v]?([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})`/i, `\`${tag}\``)
      line = line.replace(/"[v]?([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})"/i, `"${tag}"`)
    }

    // add new patch to the patches section
    if (RegExp(`livingdocs ${repoType} patches`, 'ig').test(lastLine)) {
      const newNote = `- [${tag}](https://github.com/${owner}/${repo}/releases/tag/${tag}): ${message}`
      line = `${newNote}\n${line}`
    }

    parsedReleaseNote = parsedReleaseNote === '' ? line : `${parsedReleaseNote}\n${line}`
    lastLine = line
  })

  return parsedReleaseNote
}
