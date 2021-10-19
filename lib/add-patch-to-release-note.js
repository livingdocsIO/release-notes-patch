// @return {String} base64 encoded and parsed releaseNotes
module.exports = ({owner, repo, releaseNote, tag, path, message}) => {
  // init
  let repoType = ''
  if (repo === 'livingdocs-server') repoType = 'server'
  if (repo === 'livingdocs-editor') repoType = 'editor'

  // do nothing when tag info already exists in release notes
  if (releaseNote.includes(tag)) {
    throw (new Error(
      `https://github.com/${owner}/${repo}/blob/master/${path} will not be updated, because ${tag} is already documented`
    ))
  }

  const originalReleaseNotes = releaseNote.split(/\r?\n/)
  const parsedReleaseNotes = []

  for (const [line, originalLine] of originalReleaseNotes.entries()) {
    // add new patch to the patches section
    if (RegExp(`livingdocs ${repoType} patches`, 'ig').test(originalReleaseNotes[line - 1])) {
      const newPatchLine = `- [${tag}](https://github.com/${owner}/${repo}/releases/tag/${tag}): ${message}`
        .replace(/(\r\n|\n|\r)/gm, '\n') // unify line breaks
        .split('\n') // prepare to only take the first part of the commit message
      console.log(`\n\nAdd line to patch section:\n\n${newPatchLine[0]}\n\n`)
      parsedReleaseNotes.push(newPatchLine[0])
    }

    // update tag of the introduction in the release-notes
    if (originalLine.includes(repoType)) {
      let patchedLine = originalLine
      patchedLine = patchedLine.replace(/`[v]?([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})`/i, `\`${tag}\``)
      patchedLine = patchedLine.replace(/"[v]?([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})"/i, `"${tag}"`)
      parsedReleaseNotes.push(patchedLine)
    } else {
      parsedReleaseNotes.push(originalLine)
    }
  }
  return parsedReleaseNotes.join('\n')
}
