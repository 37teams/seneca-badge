const assert = require('assert')
const Badge = require('./badge')
const { internalAction, getPattern, getPlugin } = require('./utils')

module.exports = function BadgeTransport(options) {
  options = options || {}
  options.authorize = options.authorize || true
  const seneca = this

  seneca.inward(badgeInward)
  seneca.outward(badgeOutward)

  function badgeInward(ctx, data) {
    if (internalAction(data.msg)) return

    const msg = data.msg
    const meta = data.meta

    // Get badge info from all places
    const badge = ctx.seneca.fixedargs.badge$ || msg.badge$ || null
    const policy = ctx.actdef.raw.policy$ || null

    // Apply badge to all places
    ctx.seneca.fixedargs.badge$ = badge
    msg.badge$ = badge

    if (!options.authorize) return

    const isAuthorized = options.autorization
      ? options.autorization()
      : Badge(policy, badge)

    if (!isAuthorized) {
      return {
        kind: 'result',
        result: { ok: false, why: 'Unauthorized' }
      }
    }
  }

  function badgeOutward(ctx, data) {
    const msg = data.msg
    const meta = data.meta

    // Ignore internal actions
    if (internalAction(msg)) return

    const badge = ctx.seneca.fixedargs.badge$ || msg.badge$ || null
    ctx.seneca.fixedargs.badge$ = badge
    msg.badge$ = badge
  }
}
