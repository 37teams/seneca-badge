# Seneca Badge

An authorization plugin for seneca. An action/command should be responsible for knowing the the requester/actor is allowed do the thing it can do. With badge when you authenticate a requester they get a badge which travels with them throughout the service mesh. A seneca action can describe an authorization policy within its pattern. If the policy is met, then the action will run. This achieves keeping the authorization code out of the action yet still requiring the action to dictate it's policy.

# Example

To use badge, you simply need to add the transport extention to the service.

**srv.js**

```
const seneca = require('seneca')
const { Badge } = require('seneca-badge')
const src = require('./src)

seneca()
  .use(Badge())
  .use(src)
```

**src.js**

```
module.exports = function example(options) {
  const seneca = this
  const {add} = seneca

  /**
  * To be greeted you need to have the role admin
  * and have an attribute test.
  **/
  add(
    {
      role: 'example',
      cmd: 'hello',
      policy$: {
        roles: ['admin'],
        attrs: ['test']
      }
    },
    cmdHello
  )

  /**
  * To retrieve this entity we require the request
  * to either be an admin or an owner of resource
  * with a given id.
  **/
  add(
    {
      role: 'example',
      cmd: 'get',
      policy$: {
        resources:[{
          id: 'id',
          roles: ['owner']
        }]
        roles: ['admin']
      }
    },
    cmdGet
  )

  function cmdHello(msg, reply) {
    reply(null, {
      ok: true,
      greeting: 'Hello admin'
    })
  }

  function cmdGet(msg, reply) {
    reply(null, {
      ok: true,
      ...retrievedEntity
    })
  }
}
```

## Policies

A policy discribes the ACL's that need to be satisfied in order for an action to run.

**roles**

**attrs**

**resources**
Often you need to be able to insure that a users policy is scoped to that of a resource. This is
done by adding a `resources` property to the policy. `resources` is an array with a scoped resource
policy. A resource policy has an id whose value should be the path to the id of the resource on the
msg object where the parent `msg` is implied. For example, say the resource id in question has a path
of `msg.id`. Well, then you would add `id: 'id'` to the policy. The resource policy carries the same
controls as the main policy.

_example_

```
{
  ...
  policy$: {
    resource: [{
      id: 'id', // Path to value on msg object.
      roles: ['admin'],
      attrs: ['billing', 'spawn_accounts', 'spawn_admin']
    }],
    roles: ['admin'],
    attrs: ['cool_attr']
  }
}
```

**Note** Don't forget that the parent policy will override and win over any resource. In the above example,
if a badge has global role of `admin` and an attribute of `cool_attr`, then the action will process the
message regardless of the resource policy.
