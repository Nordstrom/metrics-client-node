# metrics-client-node
[![Build Status](https://travis-ci.org/Nordstrom/metrics-client-node.svg?branch=master)](https://travis-ci.org/Nordstrom/metrics-client-node)[![Coverage Status](https://coveralls.io/repos/github/Nordstrom/metrics-client-node/badge.svg)](https://coveralls.io/github/Nordstrom/metrics-client-node)[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Metrics Client to send metrics to Telegraf via different protocols with configurable buffering feature

## Install
Install with
```
npm install git+https://github.com/Nordstrom/metrics-client-node.git --save
```

### Usage
To get started, initialize a new instance with protocol.
```js
const MetricsClient = require('metrics-client-node')
var client = new MetricsClient({
      protocol: 'udp',
      host: 'localhost',
      port: 8092
    })
```
Or to enable buffer
```js
const MetricsClient = require('metrics-client-node')
var client = new MetricsClient({
        protocol: 'http',
        bufferEnabled: true,
        host: metrics.lambda.uri,
        port: +metrics.lambda.port,
        database: metrics.influxdb,
        maxBufferSize: +metrics.bufferSize,
        flushInterval: +metrics.flushInterval
    })
```

To send message(s)
```js
client.send(message)
```
We accept one message or a list of messages, which needs to have a format of 
```json
{
    measure: 'measure-name',
    fields: { field1: 123, field2: 'someOtherValse' },
    tags: { tag1: 'tag1', tag2: 'tag2'}
}
```

To close the client
```js
client.close()
```

### Limitation
We only support 2 protocols: http and udp; and udp is only default protocol.
