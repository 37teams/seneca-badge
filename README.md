# Seneca Badge

An authorization plugin for seneca. An action/command should be responsible for knowning the the requester/actor is allowed do the thing it can do. With badge when you authenticate a requester they get a badge which travels with them throughout the service mesh. A seneca action can describe an authorization policy within its pattern. If the policy is met, then the action will run. This achieves keeping the authorization code out of the action yet still requiring the action dictate its policy.

#### Dependencies

This module depends on the following modules:  
`seneca-extend-add`

# Example

**Service file**

```
const seneca = require('seneca')
const badge = require('seneca-badge')

seneca().use(badge.transport)
```

**plugin src**

```
const badge = require('seneca-badge')
const extendAdd = require('seneca-extend-add')

module.exports = function example(options) {
  const seneca = this
  const add = extendAdd(seneca, [badge.wrapper])

  add(
    {
      role: 'example',
      cmd: 'get',
      policy$: {
        roles: ['admin'],
        attrs: ['test']
      }
    },
    hello
  )

  function hello(msg, reply) {
    reply(null, {ok: true})
  }
}
```
