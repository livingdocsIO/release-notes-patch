const moment = require('moment')

// @params {
//   time: '2019-11',
//   months: {before: 1, after: 1}
// }
// @returns ['release-2019-11', 'release-2019-10', 'release-2019-12']
module.exports = ({time, months}) => {
  const list = [time]

  for (let before = 1; before <= months.before; before++) {
    list.push(moment(time, 'YYYY-MM').subtract(before, 'M').format('YYYY-MM'))
  }

  for (let after = 1; after <= months.after; after++) {
    list.push(moment(time, 'YYYY-MM').add(after, 'M').format('YYYY-MM'))
  }

  return list.map(month => `release-${month}`)
}
