const Badge = require('./badge')

module.exports = pattern => reply => next => args => {
  const { policy$ } = pattern
  const { badge$ } = args
  const allow = Badge(policy$, badge$)

  allow ? next(args) : reply(null, { ok: false, why: 'unauthorized' })
}
