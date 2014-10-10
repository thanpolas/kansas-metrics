# Kansas Metrics

> Metrics utilities for the [Kansas package][]

[![Build Status](https://secure.travis-ci.org/thanpolas/kansas-metrics.png?branch=master)](http://travis-ci.org/thanpolas/kansas-metrics)

## Install

Install the module using NPM:

```
npm install kansas-metrics --save
```

## <a name='TOC'>Table of Contents</a>

1. [Overview](#overview)
1. [API](#api)

## Overview

```js
var kansasMetrics = require('kansasMetrics');

kansasMetrics()
    .user('unique uid')
    .from(fromDt)
    .to(toDt)
    .fetch()
    .then(function(results) {})
    .catch(function(err) {});
```

## API

Kansas Metrics needs to be initialized for each new query you want to perform.

```js
var query = kansasMetrics();
```

### Query Methods

The following query methods are available:

#### <a name='user'>user()</a>

Query by owning user id.

> #### query.user(query)
>
>    * **query** `string|Array` Owner id or array of owner ids.
>
> *Returns* `self` Chainable.

As a single string:

```js
kansasMetrics()
    .user('unique uid')
    .fetch()
    .then(function() {});
```

You can add multiple `user()` queries:

```js
kansasMetrics()
    .user('unique uid')
    .user('another unique uid')
    .user('one more unique uid')
    .fetch()
    .then(function() {});
```

Or as a single array:

```js
kansasMetrics()
    .user(['unique uid', 'another unique uid', 'one more unique uid'])
    .fetch()
    .then(function() {});
```

**[[⬆]](#TOC)**


## Release History

- **v0.0.1**, *TBD*
    - Big Bang

## License

Copyright (c) 2014 Thanasis Polychronakis. Licensed under the MIT license.

[kansas package]: https://github.com/thanpolas/kansas
