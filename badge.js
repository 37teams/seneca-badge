const { isMatch, isEmpty } = require('lodash')

const isGranted = grant => requirement => {
  return isMatch(grant, requirement)
}

module.exports = function(policy, badge) {
  let allow = false

  if (!policy || isEmpty(policy)) return true
  if (!badge || isEmpty(badge)) return false

  if (policy.attrs) {
    allow = isGranted(badge.attrs)(policy.attrs)
  }

  if (policy.roles) {
    allow = isGranted(badge.roles)(policy.roles)
  }

  if (policy.resources) {
    allow = isGranted(badge.resources)(policy.resources)
  }

  return allow
}
