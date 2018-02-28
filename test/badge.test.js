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
    const policy = { roles: ['pass'] }
    const badge = { roles: ['pass'] }
    expect(Badge(policy, badge)).to.be.true()
  })

  it('Passes if object roles policy is granted', async function() {
    const policy = { roles: [{ id: 'pass' }] }
    const badge = { roles: [{ id: 'pass' }] }
    expect(Badge(policy, badge)).to.be.true()
  })

  it('Passes if attrs policy is granted', async function() {
    const policy = { attrs: ['pass'] }
    const badge = { attrs: ['pass'] }
    expect(Badge(policy, badge)).to.be.true()
  })

  it('Passes if resource policy is granted', async function() {
    let policy = { resources: [{ id: 'test', role: 'admin' }] }
    let badge = { resources: [{ id: 'test', role: 'admin' }] }
    expect(Badge(policy, badge)).to.be.true()

    policy = { resources: [{ id: 'pass', role: 'pass', attrs: ['pass'] }] }
    badge = {
      resources: [{ id: 'pass', role: 'pass', attrs: ['pass', 'extra'] }]
    }
    expect(Badge(policy, badge)).to.be.true()
  })
})
