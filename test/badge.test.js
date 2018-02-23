const Code = require('code')
const Lab = require('lab')

const lab = (exports.lab = Lab.script())
const { beforeEach, describe, it } = lab
const { expect, fail } = Code

const badgeActionExt = require('../ext-add')

describe('badge', function() {
  it('Passes if no policy exists', async function() {
    const done = () => expect('was hit').to.exist()
    const reply = () => {}
    const pattern = {}
    const argsMOck = {}
    badgeActionExt(pattern)(reply)(done)(argsMOck)
  })

  it('Passes if roles policy is granted', async function() {
    const done = args => {
      expect(args).to.exist()
    }

    const reply = () => {}
    const pattern = { policy$: { roles: ['pass'] } }
    const argsMOck = { badge$: { roles: ['pass'] } }
    badgeActionExt(pattern)(reply)(done)(argsMOck)
  })

  it('Passes if attrs policy is granted', async function() {
    const done = args => {
      expect(args).to.exist()
    }

    const reply = () => {}
    const pattern = { policy$: { attrs: ['pass'] } }
    const argsMOck = { badge$: { attrs: ['pass'] } }
    badgeActionExt(pattern)(reply)(done)(argsMOck)
  })

  it('Passes if policies are granted', async function() {
    const done = args => {
      expect(args).to.exist()
    }

    const reply = () => {}
    const pattern = { policy$: { roles: ['pass'], attrs: ['pass'] } }
    const argsMOck = { badge$: { roles: ['pass'], attrs: ['pass'] } }
    badgeActionExt(pattern)(reply)(done)(argsMOck)
  })

  it('Fails auth if no badge but policy exists', async function() {
    const done = () => {}
    const reply = (err, args) => {
      expect(args.ok).to.be.false()
      expect(args.why).to.equal('unauthorized')
    }
    const pattern = { policy$: { exists: true } }
    const argsMOck = {}
    badgeActionExt(pattern)(reply)(done)(argsMOck)
  })

  it('Fails auth if role policy doesnt resolve', async function() {
    const done = () => {}
    const reply = (err, args) => {
      expect(args.ok).to.be.false()
      expect(args.why).to.equal('unauthorized')
    }
    const pattern = { policy$: { roles: ['fail'] } }
    const argsMOck = { badge$: { roles: ['miss'] } }
    badgeActionExt(pattern)(reply)(done)(argsMOck)
  })

  it('Fails auth if attrs policy doesnt resolve', async function() {
    const done = () => {}
    const reply = (err, args) => {
      expect(args.ok).to.be.false()
      expect(args.why).to.equal('unauthorized')
    }
    const pattern = { policy$: { attrs: ['fail'] } }
    const argsMOck = { badge$: { attrs: ['miss'] } }
    badgeActionExt(pattern)(reply)(done)(argsMOck)
  })

  it('Fails auth if role policy doesnt resolve', async function() {
    const done = () => {}
    const reply = (err, args) => {
      expect(args.ok).to.be.false()
      expect(args.why).to.equal('unauthorized')
    }
    const pattern = { policy$: { roles: ['miss'], attrs: ['pass'] } }
    const argsMOck = { badge$: { roles: ['pass'], attrs: ['pass'] } }
    badgeActionExt(pattern)(reply)(done)(argsMOck)
  })
})
