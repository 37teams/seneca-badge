const Badge = require('./badge')

const msg = { id: 'pass' }
const badge = { resources: [{ id: 'pass', roles: 'admin' }] }
const policy = { resource: { id: 'id', roles: 'admin' } }
const pass = Badge(policy, badge, msg)

console.log(pass)
