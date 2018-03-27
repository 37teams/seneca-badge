const Code = require('code')
const Lab = require('lab')

const lab = (exports.lab = Lab.script())
const { beforeEach, describe, it } = lab
const { expect, fail } = Code

const Badge = require('../badge')

describe('badge', function() {
  it('Passes if no policy exists', async function() {
    const policy = null
    const badge = {}
    expect(Badge(policy, badge)).to.be.true()
  })

  it('Fails if policy exists but no badge', async function() {
    const policy = { exists: true }
    const badge = null

    expect(Badge(policy, badge)).to.be.false()
    expect(Badge(policy, {})).to.be.false()
  })

  it('Passes if roles policy is granted', async function() {
    let policy
    let badge

    policy = { roles: ['pass'] }
    badge = { roles: ['pass'] }
    expect(Badge(policy, badge)).to.be.true()

    policy = { roles: ['a', 'b'] }
    badge = { roles: ['a'] }
    expect(Badge(policy, badge)).to.be.true()

    policy = { roles: 'a' }
    badge = { roles: 'a' }
    expect(Badge(policy, badge)).to.be.true()

    policy = { roles: ['a', 'b'] }
    badge = { roles: ['a', 'c'] }
    expect(Badge(policy, badge)).to.be.true()

    policy = { roles: [{ id: 'pass' }] }
    badge = { roles: [{ id: 'pass' }] }
    expect(Badge(policy, badge)).to.be.true()
  })

  it('Fails if roles policy is breached', async function() {
    let policy
    let badge

    policy = { roles: ['pass'] }
    badge = { roles: ['fail'] }
    expect(Badge(policy, badge)).to.be.false()

    policy = { roles: ['a', 'b'] }
    badge = { roles: ['c'] }
    expect(Badge(policy, badge)).to.be.false()

    policy = { roles: 'b' }
    badge = { roles: 'a' }
    expect(Badge(policy, badge)).to.be.false()

    policy = { roles: ['a', 'b'] }
    badge = { roles: ['c', 'd'] }
    expect(Badge(policy, badge)).to.be.false()

    policy = { roles: [{ id: 'pass' }] }
    badge = { roles: [{ id: 'fail' }] }
    expect(Badge(policy, badge)).to.be.false()
  })

  it('Passes if resource policy is granted', async function() {
    const msg = { id: 'pass' }
    let badge = { resources: [{ id: 'pass', roles: 'admin' }] }
    let policy = { resource: { id: 'id', roles: 'admin' } }
    expect(Badge(policy, badge, msg)).to.be.true()
  })

  it('Fails if resource policy is rejected', async function() {
    const msg = { id: 'fail' }
    let badge = { resources: [{ id: 'test', roles: 'admin' }] }
    let policy = { resource: { id: 'id', roles: 'admin' } }

    expect(Badge(policy, badge, msg)).to.be.false()
  })
})
