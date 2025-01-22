// @return {String} base64 encoded and parsed releaseNotes
module.exports = ({repo, releaseNote, tag, pull}) => {
  const parsedReleaseNotes = releaseNote.split(/\r?\n/)

  const index = parsedReleaseNotes.findIndex((l) => l === '## PRs to Categorize')
  if (index === -1) return parsedReleaseNotes.join('\n')

  // add new patch to the patches section
  // - [this is my pr title](https://github.com/octocat/Hello-World/pull/1347) :gift:
  const patchLine = `- [${pull.title}](${pull.htmlUrl})`
  console.log(`\n\nAdd line to upcoming release:\n\n${patchLine}\n\n`)
  parsedReleaseNotes.splice(index + 1, 0, patchLine)

  return parsedReleaseNotes.join('\n')
}
