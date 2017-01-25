'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const BufferMessenger = require('buffered-messenger-node')
const handlers = require('./handlers')

/*
 * Metrics Client sends metrics via different handler.
 */
var MetricsClient = function (options) {
  var self = this
  var handler = options.handler && _.isFunction(options.handler)
    ? options.handler(options)
    : handlers[options.handler](options) || _.noop

  self.client = new BufferMessenger({
    handler: handler,
    maxBufferSize: options.maxBufferSize,
    flushInterval: options.flushInterval
  })
}

MetricsClient.prototype.send = function (metrics) {
  var self = this
  if (!_.isArray(metrics)) {
    return self.client.send(metrics)
  }
  return Promise.each(metrics, function (item) {
    return self.client.send(item)
  })
}

MetricsClient.prototype.close = function () {
  var self = this
  return self.client.close()
}

module.exports = MetricsClient
