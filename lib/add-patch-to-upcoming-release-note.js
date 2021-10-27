// @return {String} base64 encoded and parsed releaseNotes
module.exports = ({repo, releaseNote, tag, pull}) => {
  const originalReleaseNotes = releaseNote.split(/\r?\n/)
  const parsedReleaseNotes = []

  for (const [line, originalLine] of originalReleaseNotes.entries()) {
    if (isCategorisationSection(originalReleaseNotes, line)) {
      // add new patch to the patches section
      // * v50.1.9 this is my pr title [livingdocs-server #8122](https://github.com/octocat/Hello-World/pull/1347) :gift:
      const patchLine = `* :new: ${pull.title} [${repo} #${pull.number} ${tag}](${pull.htmlUrl})`
      console.log(`\n\nAdd line to upcoming release:\n\n${patchLine}\n\n`)
      parsedReleaseNotes.push(patchLine)
    }
    parsedReleaseNotes.push(originalLine)
  }
  return parsedReleaseNotes.join('\n')
}

function isCategorisationSection (notes, line) {
  if (notes[line - 1] === '## PRs to Categorize') return true
}
