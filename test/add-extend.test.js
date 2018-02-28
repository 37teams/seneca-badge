const Code = require('code')
const Lab = require('lab')

const lab = (exports.lab = Lab.script())
const { beforeEach, describe, it } = lab
const { expect, fail } = Code

const badgeActionExt = require('../ext-add')

describe('badge extend add', function() {
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
})
