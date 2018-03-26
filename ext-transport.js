const assert = require('assert')
const Badge = require('./badge')
const { internalAction, getPattern, getPlugin } = require('./utils')

module.exports = function BadgeTransport(options) {
  options = options || {}
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
    if (badge) {
      ctx.seneca.fixedargs.badge$ = badge
      msg.badge$ = badge
    }

    let isAuthorized = false

    if (options.authorization) {
      isAuthorized = options.authorization(policy, badge, msg)
    } else {
      // TODO: think through allowing policy to reference msg values
      isAuthorized = Badge(policy, badge, msg)
    }

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
    if (badge) {
      ctx.seneca.fixedargs.badge$ = badge
      msg.badge$ = badge
    }
  }
}
