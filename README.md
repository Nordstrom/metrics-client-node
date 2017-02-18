# metrics-client-node
[![Build Status](https://travis-ci.org/Nordstrom/metrics-client-node.svg?branch=master)](https://travis-ci.org/Nordstrom/metrics-client-node)[![Coverage Status](https://coveralls.io/repos/github/Nordstrom/metrics-client-node/badge.svg)](https://coveralls.io/github/Nordstrom/metrics-client-node)[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Metrics Client to send metrics to Telegraf via different protocols with configurable buffering feature

## Install
Install with
```
npm install metrics-client --save
```

### Usage
To get started, initialize a new instance with protocol. 
```js
const MetricsClient = require('metrics-client')
var client = new MetricsClient({
      handler: 'telegrafHttpHandler',
      host: 'localhost',
      port: 8186,
      database: 'test',
      maxBufferSize: 0
    })
```


To send message(s)
```js
client.send(message)
```
We accept one message or a list of messages, which needs to have a format of 
```js
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
We only have 2 handler implementations: telegrafHttpHandler and telegrafUdpHandler. User can provide the implementation of its own handler implementation.
```js
var handler = function(options) {
    return (messages) => {
        // implementation here
    }
}
```

