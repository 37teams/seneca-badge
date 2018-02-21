const _ = require('lodash')

exports.internalAction = function(msg) {
  return (
    msg.role === 'seneca' ||
    msg.role === 'transport' ||
    msg.role === 'options' ||
    msg.role === 'mesh' ||
    msg.init
  )
}

exports.getPattern = function(msg, meta) {
  return meta ? meta.pattern : msg.meta$ ? msg.meta$.pattern : null
}

exports.getPlugin = function(msg, meta) {
  return meta ? meta.plugin_name : msg.meta$ ? msg.meta$.plugin_name : null
}
