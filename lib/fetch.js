/**
 * @fileOverview The fetch() method mixin implementation.
 */

var cip = require('cip');
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
  console.log('FETCH');
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
      console.log('key:', key);
      return self.smembers(key)
        .then(function(res) {
          console.log('RES:', res);
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
  console.log('generateQuery() :: userTokens:', userTokens);
});

Fetch.prototype.fetchKeys = Promise.method(function() {

});

Fetch.prototype.processResults = Promise.method(function() {

});

