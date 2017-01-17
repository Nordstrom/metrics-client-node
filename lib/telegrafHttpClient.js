'use strict'

const _ = require('lodash')
const influx = require('influx')
const utils = require('./utils.js')

var TelegrafHttpClient = function (options) {
  var self = this
  self.client = new influx.InfluxDB('http://' + (options.host || 'localhost') + ':' + (options.port || 8186) + '/' + options.database)
}

TelegrafHttpClient.prototype.send = function (metrics) {
  var self = this
  var formattedMetrics = utils.formatHttpMetrics(metrics)
  return self.client.writePoints(formattedMetrics)
        .then(function (results) {
          console.log('Written points')
        })
        .catch(function (err) {
          console.error('ERROR sending the metrics: ', (err.error || err))
        })
}

TelegrafHttpClient.prototype.close = function () {
  _.noop()
}

module.exports = TelegrafHttpClient
