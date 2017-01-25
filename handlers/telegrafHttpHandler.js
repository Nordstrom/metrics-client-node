'use strict'

const _ = require('lodash')
const influx = require('influx')

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

module.exports = function (options) {
  return (messages) => {
    var url = 'http://' + (options.host || 'localhost') + ':' + (options.port || 8186) + '/' + options.database
    var InfluxClient = new influx.InfluxDB(url)

    return InfluxClient.writePoints(formatHttpMetrics(messages))
      .then(function () {
        console.log('Written points')
      })
      .catch(function (err) {
        console.error('ERROR sending the influx line metrics: ', (err.error || err))
      })
  }
}
