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
var Fetch = module.exports = cip.extend();

/**
 * Execute the query.
 *
 * @return {Promise} The instance promise.
 */
Fetch.prototype.fetch = Promise.method(function() {
  if (this.fetched) {
    // try to contain the error only in the fetch() invocation
    // and do not propagate it in the master defer.
    throw new appErr.Error('Already fetched from redis');
  }
  this.fetched = true;

  this.resolveTokensByUser()
    .bind(this)
    .then(this.generateQuery)
    .then(this.fetchKeys)
    .then(this.processResults)
    .catch(function(err) {
      console.error(err);
    });

  // 'this' is now the Promise that was returned in the Ctor.
  return this;
});

/**
 * Will resolve all ownerIds to tokens if they exist in the query.
 *
 * @return {Promise(Array)} A Promise with an array of tokens.
 */
Fetch.prototype.resolveTokensByUser = Promise.method(function() {
  var indexKeys = this.query.user.map(function(ownerId) {
    return this.prefix + ':kansas:index:token:' + ownerId;
  }, this);

  var self = this;
  return Promise.resolve(indexKeys)
    .map(function(key) {
      return self.smembers(key)
        .then(function(res) {
          return res;
        });
    });
});

/**
 * Generates the execution query object based on the internal query.
 *
 * @return {Promise(Object)} A Promise with the execution query, contains:
 */
Fetch.prototype.generateQuery = Promise.method(function(userTokens) {
  var flattenedUserTokens = __.flatten(userTokens);

  var allTokens = this.query.token.concat(flattenedUserTokens);

  if (allTokens.length) {
    return this._generateUsingTokens(allTokens);
  } else {
    return this._generateWithNoTokens();
  }
});

Fetch.prototype._generateUsingTokens = function(allTokens) {
  var prefix = this.prefix + ':kansas:usage:';
  return allTokens.map(function(token) {
    if (this.query.from) {

    }

  }, this);
};

/**
 * Prepares the date range query, will return an array with the date ranges
 * to query, bare without prefixes.
 *
 * @return {Array.<string>} Array items to query by, eg '2014-05-01'.
 */
Fetch.prototype._prepareDateKeys = function() {
  if (!this.query.from && !this.query.to) {
    return [];
  }

  // Set default TO range to today.
  var now = Date.now();
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
  for (var year = fromYear; year < toYear; year++) {
    for (var month = fromMonth; year < toYear && month < toMonth ||
      month < 11; month++) {
      ranges.push(year + '-' + month + '-' + '01');
    }
  }
  return ranges;
};

Fetch.prototype.fetchKeys = Promise.method(function() {

});

Fetch.prototype.processResults = Promise.method(function() {

});

