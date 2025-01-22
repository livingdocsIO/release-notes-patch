// @params {
//   time: '2019-11',
//   months: {before: 1, after: 1}
// }
// @returns ['release-2019-11', 'release-2019-10', 'release-2019-12']
module.exports = ({time, months}) => {
  const list = [time]

  for (let before = 1; before <= months.before; before++) {
    const date = new Date(time)
    date.setDate(15)
    date.setMonth(date.getMonth() - before)
    list.push(date.toISOString().slice(0, 7))
  }

  for (let after = 1; after <= months.after; after++) {
    const date = new Date(time)
    date.setDate(15)
    date.setMonth(date.getMonth() + after)
    list.push(date.toISOString().slice(0, 7))
  }

  return list.map(month => `release-${month}`)
}
