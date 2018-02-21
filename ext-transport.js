const assert = require('assert')
const { internalAction, getPattern, getPlugin } = require('./utils')

module.exports = function Badge(options) {
  options = options || {}
  const seneca = this

  seneca.inward(badgeInward)
  seneca.outward(badgeOutward)

  function badgeInward(ctx, data) {
    if (internalAction(data.msg)) {
      return
    }

    const msg = data.msg
    const meta = data.meta

    // Get badge info from all places
    const badge = ctx.seneca.fixedargs.badge$ || msg.badge$ || null

    // Apply badge to all places
    ctx.seneca.fixedargs.badge$ = badge
    msg.badge$ = badge
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
