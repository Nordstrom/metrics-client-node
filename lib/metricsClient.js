'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const influx = require('influx')
const telegraf = require('telegrafjs')
const BufferMessenger = require('buffered-messenger-node')
const TelegrafUdpClient = require('./telegrafUdpClient.js')
const TelegrafHttpClient = require('./telegrafHttpClient.js')
const utils = require('./utils.js')

function httpBufferedHandler (options) {
  return (messages) => {
    var url = 'http://' + (options.host || 'localhost') + ':' + (options.port || 8186) + '/' + options.database
    var InfluxClient = new influx.InfluxDB(url)

    return InfluxClient.writePoints(utils.formatHttpMetrics(messages))
      .then(function () {
        console.log('Written points')
      })
      .catch(function (err) {
        console.error('ERROR sending the influx line metrics: ', (err.error || err))
      })
  }
}

function udpBufferedHandler (options) {
  return (messages) => {
    var udpClient = new telegraf.TelegrafUDPClient({
      host: options.host,
      port: options.port
    })
    return udpClient.connect()
      .then(function () {
        return udpClient.sendMeasurement(utils.formatUdpMessages(messages))
      })
      .then(function () {
        return udpClient.close()
      })
      .catch(function (err) {
        console.error('ERROR sending the metrics: ', (err.error || err))
      })
  }
}

/*

 */
var MetricsClient = function (options) {
  var self = this

  self.bufferEnabled = options.bufferEnabled || false
  self.protocol = options.protocol || 'udp'
  if (self.bufferEnabled) {
    self.client = new BufferMessenger({
      handler: self.protocol === 'http'
        ? httpBufferedHandler({
          host: options.host,
          port: options.port,
          database: options.database
        })
        : udpBufferedHandler({
          host: options.host,
          port: options.port
        }),
      maxBufferSize: options.maxBufferSize,
      flushInterval: options.flushInterval
    })
  } else {
    self.client = self.protocol === 'http'
      ? new TelegrafHttpClient({
        host: options.host,
        port: options.port,
        database: options.database
      })
      : new TelegrafUdpClient({
        host: options.host,
        port: options.port
      })
  }
}

MetricsClient.prototype.send = function (metrics) {
  var self = this
  if (!_.isArray(metrics) || !self.bufferEnabled) {
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
