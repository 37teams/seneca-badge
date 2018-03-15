const { isMatch, isEmpty } = require('lodash')

const isGranted = requirement => grant => {
  return isMatch(grant, requirement)
}

const interpolate = (defs, msg) => {
  return defs.map(def => {
    def.id = msg[def.id]
    return def
  })
}

module.exports = function(policy, badge, msg) {
  let allow = false

  if (!policy || isEmpty(policy)) return true
  if (!badge || isEmpty(badge)) return false

  if (policy.attrs) {
    allow = isGranted(badge.attrs)(policy.attrs)
  }

  if (policy.roles) {
    allow = isGranted(badge.roles)(policy.roles)
  }

  if (allow) {
    return allow
  }

  if (policy.resources) {
    allow = isGranted(interpolate(policy.resources, msg))(badge.resources)
  }

  return allow
}
