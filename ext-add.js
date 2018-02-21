const isGranted = grants => {
  return requirement => {
    return grants.indexOf(requirement) > -1
  }
}

module.exports = pattern => reply => next => args => {
  const { policy$ } = pattern
  const { badge$ } = args
  let allowed = false

  if (!policy$) {
    return next(args)
  }

  if (!badge$) {
    return reply(null, { ok: false, why: 'unauthorized' })
  }

  if (policy$.attrs) {
    allow = policy$.attrs.every(isGranted(badge$.attrs))
  }

  if (policy$.roles) {
    allow = policy$.roles.every(isGranted(badge$.roles))
  }

  if (!allow) {
    return reply(null, { ok: false, why: 'unauthorized' })
  }

  next(args)
}
