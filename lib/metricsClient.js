'use strict'

const influx = require('influx')
const telegraf = require('telegrafjs')
const BufferMessenger = require('buffered-messenger-node')
const TelegrafUdpClient = require('./telegrafUdpClient.js')
const TelegrafHttpClient = require('./telegrafHttpClient.js')

function httpBufferedHandler (options) {
  return (message) => {
    var url = 'http://' + (options.host || 'localhost') + ':' + (options.port || 8186) + '/' + options.database
    var InfluxClient = new influx.InfluxDB(url)

    return InfluxClient.writePoints(message)
      .then(function () {
        console.log('Written points')
      })
      .catch(function (err) {
        console.error('ERROR sending the influx line metrics: ', (err.error || err))
      })
  }
}

function udpBufferedHandler (options) {
  return (message) => {
    var udpClient = new telegraf.TelegrafUDPClient({
      host: options.host,
      port: options.port
    })
    return udpClient.connect()
      .then(function () {
        return udpClient.sendMeasurement(message)
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
      maxBufferSize: options.bufferSize,
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
  return self.client.send(metrics)
}

MetricsClient.prototype.close = function () {
  var self = this
  return self.client.close()
}

module.exports = MetricsClient
