'use strict'

const _ = require('lodash')
const telegraf = require('telegrafjs')

// const MetricsClient = require('./metricsClient').MetricsClient
//
// class TelegrafUDPClient extends MetricsClient {
//
//   send (options) {
//     return function (message) {
//       var metricsClient = new telegraf.TelegrafUDPClient({
//         host: options.host,
//         port: options.port
//       })
//       return metricsClient.connect()
//         .then(function () {
//           return metricsClient.sendMeasurement(message)
//         })
//         .then(function () {
//           return metricsClient.close()
//         })
//         .catch(function (err) {
//           console.error('ERROR sending the metrics: ', (err.error || err))
//         })
//     }
//   }
// }
//
// module.exports = {
//   TelegrafUDPClient
// }
//
// function formatMeasure(metrics) {
//   var formattedFields = {};
//   _.forEach(metrics.fields, function (value, key) {
//     formattedFields[key] = new telegraf.Float(value);
//
//   });
//   return new telegraf.Measurement(
//     metrics.measure,
//     metrics.tags,
//     formattedFields
//   );
// }

var TelegrafUDPClient = function (options) {
  var self = this
  self.client = new telegraf.TelegrafUDPClient({
    host: options.host,
    port: options.port
  })
}

TelegrafUDPClient.prototype.send = function (metrics) {
  var self = this
  return self.client.connect()
    .then(function () {
      // var formattedMeasure = formatMeasure(metrics)
      var formattedMeasure = new telegraf.Measurement(
        metrics.measure,
        metrics.tags,
        metrics.fields
      )
      return self.client.sendMeasurement(formattedMeasure)
    })
    .then(function () {
      return self.client.close()
    })
    .catch(function (err) {
      console.error('ERROR sending the metrics: ', (err.error || err))
    })
}

TelegrafUDPClient.prototype.close = function () {
  return _.noop()
}

module.exports = TelegrafUDPClient
