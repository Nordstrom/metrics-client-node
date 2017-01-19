'use strict'

const MetricsClient = require('../index.js')
const describe = require('mocha').describe
const it = require('mocha').it

describe('MetricsClient Test', function () {
  it('Test http protocl w/o buffer', function () {
    var client = new MetricsClient({
      protocol: 'http',
      host: 'localhost',
      port: 8186,
      database: 'yun_local_test'
    })

    return client.send([
      {
        measure: 'test_http_no_buffer',
        tags: { tag1: 'tag1', tag2: 'tag2' },
        fields: { duration: 40, status: 200 }
      },
      {
        measure: 'test_http_no_buffer',
        tags: { tag1: 'test-tag1', tag2: 'test-tag2' },
        fields: { duration: 2, status: 500 }
      }])
      .then(function () {
        return client.close()
      })
  })

  it('Test udp protocol w/o buffer', function () {
    var client = new MetricsClient({
      protocol: 'udp',
      host: 'localhost',
      port: 8092
    })

    return client.send([{
      measure: 'test_udp_no_buffer_3',
      tags: { tag1: 'test-tag1', tag2: 'test-tag2' },
      fields: { duration: 55, status: 200 }
    }, {
      measure: 'test_udp_no_buffer_3',
      tags: { tag1: 'test-tag1', tag2: 'test-tag2' },
      fields: { duration: 30, status: 400 }
    }])
      .then(function () {
        return client.close()
      })
  })

  it('Test http protocol with small buffer', function () {
    var client = new MetricsClient({
      protocol: 'http',
      bufferEnabled: true,
      host: 'localhost',
      port: 8186,
      database: 'yun_local_test',
      maxBufferSize: 2,
      flushInterval: 10000
    })

    return client.send([{
      measure: 'test_http_buffer',
      tags: { tag1: 'api1', tag2: 'small_buffer_1' },
      fields: { duration: 55, status: 200 }
    },
    {
      measure: 'test_http_buffer',
      tags: { tag1: 'api2', tag2: 'small_buffer_2' },
      fields: { duration: 10, status: 400 }
    },
    {
      measure: 'test_http_buffer',
      tags: { tag1: 'api3', tag2: 'small_buffer_3' },
      fields: { duration: 20, status: 500 }
    }
    ])
      .then(function () {
        console.log('flushed once before close')
        return client.close()
      })
  })

  it('Test http protocol with small interval', function () {
    var client = new MetricsClient({
      protocol: 'http',
      bufferEnabled: true,
      host: 'localhost',
      port: 8186,
      database: 'yun_local_test',
      maxBufferSize: 10,
      flushInterval: 1000
    })

    return client.send([{
      measure: 'test_http_buffer',
      tags: { tag1: 'api1', tag2: 'small_interval_1' },
      fields: { duration: 55, status: 200 }
    },
    {
      measure: 'test_http_buffer',
      tags: { tag1: 'api2', tag2: 'small_interval_2' },
      fields: { duration: 10, status: 400 }
    },
    {
      measure: 'test_http_buffer',
      tags: { tag1: 'api3', tag2: 'small_interval_3' },
      fields: { duration: 20, status: 500 }
    }
    ])
      .delay(1200)
      .then(function () {
        console.log('flushed once before close')
        return client.close()
      })
  })

  it('Test udp protocol with small buffer', function () {
    var client = new MetricsClient({
      protocol: 'udp',
      bufferEnabled: true,
      host: 'localhost',
      port: 8092,
      maxBufferSize: 2,
      flushInterval: 10000
    })

    return client.send([{
      measure: 'test_udp_buffer',
      tags: { tag1: 'api1', tag2: 'small_buffer_1' },
      fields: { duration: 55, status: 200 }
    },
    {
      measure: 'test_udp_buffer',
      tags: { tag1: 'api2', tag2: 'small_buffer_2' },
      fields: { duration: 10, status: 400 }
    },
    {
      measure: 'test_udp_buffer',
      tags: { tag1: 'api3', tag2: 'small_buffer_3' },
      fields: { duration: 20, status: 500 }
    }
    ])
      .then(function () {
        console.log('flushed once before close')
        return client.close()
      })
  })

  it('Test udp protocol with small interval', function () {
    var client = new MetricsClient({
      protocol: 'udp',
      bufferEnabled: true,
      host: 'localhost',
      port: 8092,
      maxBufferSize: 10,
      flushInterval: 1000
    })

    return client.send([{
      measure: 'test_udp_buffer',
      tags: { tag1: 'api1', tag2: 'small_interval_1' },
      fields: { duration: 55, status: 200 }
    },
    {
      measure: 'test_udp_buffer',
      tags: { tag1: 'api2', tag2: 'small_interval_2' },
      fields: { duration: 10, status: 400 }
    },
    {
      measure: 'test_udp_buffer',
      tags: { tag1: 'api3', tag2: 'small_interval_3' },
      fields: { duration: 20, status: 500 }
    }
    ])
      .delay(1200)
      .then(function () {
        console.log('flushed once before close')
        return client.close()
      })
  })
})
