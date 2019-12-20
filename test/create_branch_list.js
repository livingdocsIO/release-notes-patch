const tap = require('tap')
const createBranchList = require('../lib/create_branch_list')

// one month before and after
const branchList = createBranchList({
  time: '2019-12',
  months: {before: 1, after: 1}
})

tap.same(branchList, [
  'release-2019-12',
  'release-2019-11',
  'release-2020-01'
])


// 3 months before and 2 after
const branchList2 = createBranchList({
  time: '2019-02',
  months: {before: 3, after: 2}
})

tap.same(branchList2, [
  'release-2019-02',
  'release-2019-01',
  'release-2018-12',
  'release-2018-11',
  'release-2019-03',
  'release-2019-04'
])