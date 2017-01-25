'use strict'

const _ = require('lodash')
const telegraf = require('telegrafjs')

function formatUdpMessages (messages) {
  var buffer = ''
  if (!_.isArray(messages)) {
    messages = [messages]
  }
  _.forEach(messages, function (message) {
    var measurement = new telegraf.Measurement(
      message.measure,
      message.tags,
      message.fields
    )
    buffer += measurement.toString() + '\n'
  })
  return buffer
}

module.exports = function (options) {
  return (messages) => {
    var udpClient = new telegraf.TelegrafUDPClient({
      host: options.host,
      port: options.port
    })
    return udpClient.connect()
      .then(function () {
        return udpClient.sendMeasurement(formatUdpMessages(messages))
      })
      .then(function () {
        return udpClient.close()
      })
      .catch(function (err) {
        console.error('ERROR sending the metrics: ', (err.error || err))
      })
  }
}
