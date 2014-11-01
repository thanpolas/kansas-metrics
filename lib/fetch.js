/**
 * @fileOverview The fetch() method mixin implementation.
 */

var cip = require('cip');
var __ = require('lodash');
var Promise = require('bluebird');
var appErr = require('nodeon-error');

/**
 * The fetch() method mixin implementation.
 *
 * @constructor
 */
var Fetch = module.exports = cip.extend(function() {
  /** @type {?Object} A token based index for token items */
  this.tokenItemIndex = null;
});

/** @const {string} Wildcard used by redis for fetching keys */
Fetch.WILDCARD = '*';

/**
 * Execute the query.
 *
 * @return {Promise} The instance promise.
 */
Fetch.prototype.fetch = Promise.method(function() {
  if (this.operates || this.fetched) {
    // try to contain the error only in the fetch() invocation
    // and do not propagate it in the master defer.
    throw new appErr.Error('Already fetched from redis');
  }
  this.operates = true;

  return this._resolveTokensByUser()
    .bind(this)
    .then(this._generateKeysQuery)
    .then(this._fetchKeys)
    .then(this._fetchData)
    .spread(this._processResults)
    .catch(function(err) {
      console.error(err);
    });
});

/**
 * Will resolve all ownerIds to tokens if they exist in the query.
 *
 * @return {Promise(Array)} A Promise with an array of tokens.
 * @private
 */
Fetch.prototype._resolveTokensByUser = Promise.method(function() {
  var indexKeys = this.query.user.map(function(ownerId) {
    return this.prefix + ':kansas:index:token:' + ownerId;
  }, this);

  return Promise.resolve(indexKeys)
    .bind(this)
    .map(function(key) {
      return this.redisSmembers(key)
        .then(function(res) {
          return res;
        });
    });
});

/**
 * Generates the execution query for the KEYS redis operation.
 *
 * @return {Promise(Array.<string>)} A Promise with the execution query.
 * @private
 */
Fetch.prototype._generateKeysQuery = Promise.method(function(userTokens) {
  var flattenedUserTokens = __.flatten(userTokens);

  var allTokens = this.query.token.concat(flattenedUserTokens);

  var prefix = this.prefix + ':kansas:usage:';

  var dateRanges = this._prepareDateKeys();

  var totalTokens = allTokens.length;
  var totalDateRanges = dateRanges.length;

  var query = [];
  // get the 'fetch all records' out of the way fast...
  if (totalTokens === 0 && totalDateRanges === 0) {
    query.push(prefix += Fetch.WILDCARD);
  } else {
    if (totalDateRanges) {
      dateRanges.forEach(function(dateRange) {
        var queryPart = prefix + dateRange + ':' + Fetch.WILDCARD;
        if (totalTokens) {
          query = query.concat(this._generateTokensQuery(queryPart, allTokens));
        } else {
          query.push(queryPart);
        }
      }, this);
    } else {
      query = this._generateTokensQuery(prefix + Fetch.WILDCARD, allTokens);
    }
  }

  return query;
});

/**
 * Generate query for redis KEYS command.
 *
 * @param {string} prefix The prefix to use.
 * @param {Array.<string>} allTokens All tokens to query.
 * @return {Array.<string>} All queries based on provided arguments.
 * @private
 */
Fetch.prototype._generateTokensQuery = function(prefix, allTokens) {
  return allTokens.map(function(token) {
    return prefix + token;
  });
};

/**
 * Prepares the date range query, will return an array with the date ranges
 * to query, bare without prefixes.
 *
 * @return {Array.<string>} Array items to query by, eg ['2014-05-01'].
 */
Fetch.prototype._prepareDateKeys = function() {
  if (!this.query.from && !this.query.to) {
    return [];
  }

  // Set default TO range to today.
  var now = new Date();
  var toYear = now.getFullYear();
  var toMonth = now.getMonth();

  // Set default FROM range to when Kansas was originally released.
  var fromYear = 2013;
  var fromMonth = 2; // march
  if (this.query.from) {
    fromYear = this.query.from.getFullYear();
    fromMonth = this.query.from.getMonth();
  }

  if (this.query.to) {
    toYear = this.query.to.getFullYear();
    toMonth = this.query.to.getMonth();
  }

  var ranges = [];
  for (var year = fromYear; year <= toYear; year++) {
    var month = fromMonth;
    if (year !== fromYear) {
      month = 0;
    }
    for (; (year === toYear && month <= toMonth) ||
      (year < toYear && month <= 11); month++) {
      ranges.push(year + '-' + this._getStringMonth(month) + '-' + '01');
    }
  }
  return ranges;
};

/**
 * Returns a string format of a native Date month value (0-11).
 *
 * @param {number} month Native data month(0-11)
 * @return {string} String formated month ('01' - '12')
 */
Fetch.prototype._getStringMonth = function(month) {
  month++;
  if (month < 10) {
    return '0' + month;
  } else {
    return month + '';
  }
};

/**
 * Will perform the Redis KEYS operation and fetch all canonical keys that
 * match the desired user query.
 *
 * @param {Array.<string>} queries The KEYS queries to perform.
 * @return {Promise(Array.<string>)} A Promise with the canonical keys to fetch.
 */
Fetch.prototype._fetchKeys = Promise.method(function(queries) {
  return Promise.resolve(queries)
    .bind(this)
    .map(function(query) {
      return this.redisKeys(query);
    }, {concurrency: this._options.concurrency})
    .then(function(results) {
      this.canonicalKeys = __.flatten(results);
      return this.canonicalKeys;
    });
});

/**
 * Will parallelize fetching the usage keys and token items.
 *
 * @param {Array.<string>} keys All keys to fetch usage records for.
 * @return {Promise(Array)} Containing the results of the parallel operation.
 */
Fetch.prototype._fetchData = Promise.method(function(keys) {
  return Promise.all([
    this._fetchUsageRecords(keys),
    this._fetchTokenItems(keys),
  ]);
});

/**
 * Will fetch all the usage records based on the provided canonical keys.
 *
 * @param {Array.<string>} keys All keys to fetch usage records for.
 * @return {Promise(Array.<string>)} A promise with the results.
 * @private
 */
Fetch.prototype._fetchUsageRecords = Promise.method(function(keys) {
  return Promise.resolve(keys)
    .bind(this)
    .map(function(key) {
      return this.redisGet(key);
      // use concurrency / 2 as this is an op in parallel with another
      // redis query operation (fetch token items)
    }, {concurrency: ( this._options.concurrency / 2 )})
    .then(function(results) {
      this.usageResults = results;
      return this.usageResults;
    });
});

/**
 * Will fetch all the token items data objects.
 *
 * @param {Array.<string>} keys All keys to fetch usage records for.
 * @return {Promise(Array.<Object>)} A promise with the results.
 * @private
 */
Fetch.prototype._fetchTokenItems = Promise.method(function(keys) {
  var tokenKeys = this._extractTokenItemKeys(keys);
  return Promise.resolve(tokenKeys)
    .bind(this)
    .map(function(key) {
      return this.redisHgetall(key);

      // use concurrency / 2 as this is an op in parallel with another
      // redis query operation (fetch usage)
    }, {concurrency: ( this._options.concurrency / 2 )})
    .then(function(results) {
      this.tokenItems = results;

      // create an index of token items based on token
      this.tokenItemIndex = {};
      results.forEach(function(tokenItem) {
        this.tokenItemIndex[tokenItem.token] = tokenItem;
      }, this);
      return this.tokenItems;
    });
});

/**
 * Will extract unique token item keys from the usage keys and return
 * proper Kansas token paths for fetching the token items.
 *
 * @param {Array.<string>} keys All keys to fetch usage records for.
 * @return {Array.<strimg>} Proper Kansas key paths.
 * @private
 */
Fetch.prototype._extractTokenItemKeys = function(keys) {
  var tokens = [];
  keys.forEach(function(key) {
    var token = key.split(':').pop();
    if (tokens.indexOf(token) === -1) {
      tokens.push(token);
    }
  });

  var prefix = this.prefix + ':kansas:token:';
  return tokens.map(function(token) {
    return prefix + token;
  });
};

/**
 * Will Process all the raw redis results and combine them in a single
 * properly structured Kansas Metrics data object.
 *
 * @param {Array.<string>} usageResults The usage results as fetched.
 * @param {Array.<Object>} tokenItemResults The token items results.
 * @return {Promise(Array)} The final results.
 * @private
 */
Fetch.prototype._processResults = Promise.method(function(usageResults) {

  this.fetched = true;
  this.operates = false;

  var results = [];
  if (!usageResults.length) {
    return results;
  }
  results = usageResults.map(function(usageResult, index) {
    var canonicalKey = this.canonicalKeys[index];
    var keyParts = canonicalKey.split(':');
    var token = keyParts.pop();
    var datePeriod = keyParts.pop();
    var isCount = false;
    // beware of count type usage tokens
    if (datePeriod === 'count') {
      isCount = true;
      datePeriod = keyParts.pop();
    }
    var dtPeriod = new Date(datePeriod);
    var month = dtPeriod.getMonth() + 1;
    var year = dtPeriod.getFullYear();

    var tokenItem = this.tokenItemIndex[token];

    var item = {
      token: token,
      ownerId: tokenItem.ownerId,
      policyName: tokenItem.policyName,
      policyLimit: parseInt(tokenItem.limit, 10),
      isPolicyCount: isCount,
      month: month,
      year: year,
      date: dtPeriod.toISOString(),
      period: 'month',
      usage: parseInt(usageResult, 10),
    };
    return item;

  }, this);

  return results;
});
