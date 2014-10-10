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
    1. [Query Methods](#query-methods]
        1. [`user()` Filter by Owner Id](#user)
        1. [`token()` Filter by Token Id](#token)
        1. [`from()` and `to()` date filters](#from-to)
    1. [Query Methods](#execution-methods]
        1. [Fetching the results](#fetch)
        1. [The Results Data Object](#results)

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

#### <a name='user'>`user()` Filter by Owner Id</a>

Query by owning user id.

> #### kansasMetrics().user(query)
>
>    * **query** `string|Array` Owner id or array of owner ids.
>
> *Returns* `self` Chainable.

As a single string:

```js
kansasMetrics()
    .user('unique uid')
    .fetch()
        .then(function(results) {});
```

You can add multiple `user()` queries:

```js
kansasMetrics()
    .user('unique uid')
    .user('another unique uid')
    .user('one more unique uid')
    .fetch()
        .then(function(results) {});
```

Or as a single array:

```js
kansasMetrics()
    .user(['unique uid', 'another unique uid', 'one more unique uid'])
    .fetch()
        .then(function(results) {});
```

**[[⬆]](#TOC)**

#### <a name='token'>`token()` Filter by Token Id</a>

Query by token id.

> #### kansasMetrics().token(query)
>
>    * **query** `string|Array` Token id or array of token ids.
>
> *Returns* `self` Chainable.

As a single string:

```js
kansasMetrics()
    .token('token id')
    .fetch()
        .then(function(results) {});
```

You can add multiple `token()` queries:

```js
kansasMetrics()
    .token('token id')
    .token('another token id')
    .token('one more token id')
    .fetch()
        .then(function(results) {});
```

Or as a single array:

```js
kansasMetrics()
    .user(['token id', 'another token id', 'one more token id'])
    .fetch()
        .then(function(results) {});
```

**[[⬆]](#TOC)**

#### <a name='from-to'>`from()` and `to()` date filters</a>

Filter from and to a date.

> #### kansasMetrics().from(query)
> #### kansasMetrics().to(query)
>
>    * **query** `string|Date` Date
>
> *Returns* `self` Chainable.

Both the `from()` and `to()` methods accept any string that can evaluate to a date using the native Javascript `Date()` method. Since Kansas periods are monthly, any date passed will get rounded to the month it belongs before the query is executed, e.g,

For `from()` methods:

* 23 Sep 2014 --> 01 Sep 2014, will query from and including the month of September 2014.

For `to()` methods:

* 23 Sep 2014 --> 30 Sep 2014, will query up to and including the month of September 2014.

You may use each one of the methods on their own or both.

As a string:

```js
kansasMetrics()
    .from('01-01-2014')
    .to('05-01-2014')
    .fetch()
        .then(function(results) {});
```

As a native Date object:

```js
var dt = new Date('01-01-2014');

kansasMetrics()
    .from(dt)
    .fetch()
        .then(function(results) {});
```

**[[⬆]](#TOC)**

### Execution Methods

#### <a name='fetch'>`fetch()` Execute the Query</a>

Executes the query, returns a Promise.

> #### kansasMetrics().fetch()
>
> *Returns* `Promise(Array.<Object>)` A Promise with the [results](#results), Kansas Metrics uses the [Bluebird implementation][bluebird].

If no query methods are used then all usage records will be fetched, handle with care.

```js
kansasMetrics()
    .fetch()
        .then(function(results) {
            results.forEach(function(result) {
                console.log(result);
            });
        })
        .catch(function(err) {
            console.error('Error:', err);
        });
```

**[[⬆]](#TOC)**

#### <a name='results'>The results data objects</a>

All results produced by Kansas Metrics are Arrays of Objects. Each Object has the following schema:

* **token** {string} A 32char unique token.
* **ownerId** {string} A string uniquely identifying the owner of the token.
* **policyName** {string} The name of the policy the token belongs to.
* **policyLimit** {number} The limit enforced by the policy if it's of type Limit.
* **isPolicyCount** {boolean} Indicates if the policity is of type Count.
* **month** {number} The month this usage item refers to (1-12).
* **year** {number} The year this usage item refers to.
* **date** {string} An ISO 8601 formated date.
* **period** {string} Stubbed to `month` for now.
* **usage** {number} The units consumed or remaining depending of the Policy type (count / limit).

**[[⬆]](#TOC)**

## Release History

- **v0.0.1**, *TBD*
    - Big Bang

## License

Copyright (c) 2014 Thanasis Polychronakis. Licensed under the MIT license.

[kansas package]: https://github.com/thanpolas/kansas
[bluebird]: https://github.com/petkaantonov/bluebird
