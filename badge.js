const { isMatch, isEmpty } = require('lodash')

const interpolate = (def, msg) => {
  def.id = msg[def.id]
  return def
}

const tryPolicy = (policy, badge) => {
  let allow = false

  if (policy.attrs) {
    allow = isMatch(policy.attrs, badge.attrs)
  }

  if (policy.roles) {
    const hasRoles =
      typeof badge.roles === 'string' ? [badge.roles] : badge.roles
    const policyRoles =
      typeof policy.roles === 'string' ? [policy.roles] : policy.roles

    allow = hasRoles.some(r => isMatch(policyRoles, [r]))
  }

  return allow
}

const tryResourcePolicy = (policy, resourceGrants) => {
  const resourceGrant = resourceGrants.find(grant => policy.id === grant.id)
  if (!resourceGrant) return false

  return tryPolicy(policy, resourceGrant)
}

module.exports = function(policy, badge, msg) {
  if (!policy || isEmpty(policy)) return true
  if (!badge || isEmpty(badge)) return false

  if (policy.resource) {
    return tryResourcePolicy(interpolate(policy.resource, msg), badge.resources)
  }

  return tryPolicy(policy, badge)
}
