// @return {String} base64 encoded and parsed releaseNotes
module.exports = ({repo, releaseNote, tag, path, pull}) => {
  const originalReleaseNotes = releaseNote.split(/\r?\n/)
  const parsedReleaseNotes = []

  for (const [line, originalLine] of originalReleaseNotes.entries()) {
    if (afterHeader(originalReleaseNotes, line)) {
      // add new patch to the patches section
      // * v50.1.9 this is my pr title [livingdocs-server #8122](https://github.com/octocat/Hello-World/pull/1347) :gift:
      const patchLine = `* :new: ${pull.title} [${repo} #${pull.number} ${tag}](${pull.htmlUrl}) :gift:`
      console.log(`\n\nAdd line to upcoming release:\n\n${patchLine}\n\n`)
      parsedReleaseNotes.push(patchLine)
    }
    parsedReleaseNotes.push(originalLine)
  }
  return parsedReleaseNotes.join('\n')
}

function afterHeader (notes, line) {
  // if (line <= 3) return false

  if (
    hasDash(notes, line - 1) &&
    (
      hasDash(notes, line - 2) ||
      hasDash(notes, line - 3) ||
      hasDash(notes, line - 4) ||
      hasDash(notes, line - 5) ||
      hasDash(notes, line - 6)
    )
  ) {
    return true
  }
}

function hasDash (lines, line) {
  return lines[line] === '---'
}
