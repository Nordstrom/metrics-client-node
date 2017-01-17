'use strict'

const _ = require('lodash')
const telegraf = require('telegrafjs')

function formatHttpMetrics (metrics) {
  var formattedMetrics = []
  if (!_.isArray(metrics)) {
    metrics = [metrics]
  }
  _.forEach(metrics, function (value) {
    formattedMetrics.push({
      measurement: value.measure,
      tags: value.tags,
      fields: value.fields
    })
  })
  return formattedMetrics
}

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

module.exports = {
  formatHttpMetrics: formatHttpMetrics,
  formatUdpMessages: formatUdpMessages
}
