/**
 * @fileOverview The main Kansas Metrics module.
 */
// var __ = require('lodash');
var cip = require('cip');
var Promise = require('bluebird');
var appErr = require('nodeon-error');

var setup = require('./setup');
var Fetch = require('./fetch');

/**
 * The Kansas Metrics main module.
 *
 * @constructor
 */
var Metrics = module.exports = cip.extend(function() {
  /** @type {Kansas} The local ref to the Kansas instance */
  this.kansas = setup.kansas;

  // Check if Kansas is set.
  if (!this.kansas) {
    throw new appErr.Error('No Kansas instance was defined, use "setup()"');
  }

  // Check if Kansas is connected
  if (!this.kansas.connected) {
    throw new appErr.Error('Kansas is not connected to Redis');
  }

  /** @type {Redis} The redis client */
  this.client = this.kansas.client;

  /** @type {boolean} Indicates a query operation is taking place */
  this.operates = false;

  /** @type {boolean} Indicates query has complete and data populated */
  this.fetched = false;

  /** @type {string} Get the db keys prefix from Kansas */
  this.prefix = this.kansas._options.prefix;

  // Promisify Redis required methods
  this.redisSmembers = Promise.promisify(this.client.smembers, this.client);
  this.redisKeys = Promise.promisify(this.client.keys, this.client);
  this.redisGet = Promise.promisify(this.client.get, this.client);
  this.redisHgetall = Promise.promisify(this.client.hgetall, this.client);

  /** @type {Object} Internal query object */
  this.query = {
    user: [],
    token: [],
    from: null,
    to: null,
  };

  /** @type {Object} Internal options */
  this._options = {
    /** @type {number} How many concurrent operations to hit Redis with */
    concurrency: 10,
  };

  /** @type {?Array.<string>} All the canonical keys used to fetch usage records */
  this.canonicalKeys = null;

  /** @type {?Array.<string>} Usage results, matching index with "canonicalKeys" */
  this.usageResults = null;

  /** @type {?Array.<Object>} The token item objects */
  this.tokenItems = null;

  /** @type {Promise.Defer} The instance's master defer */
  this.defer = Promise.defer();

  /** @type {Promise} The instance's master Promise. */
  this.promise = this.defer.promise;
});

Metrics.mixin(Fetch);

/**
 * Filter by owner id.
 *
 * @param {string|Array.<string>} query The query.
 * @return {self} Chainable.
 */
Metrics.prototype.user = function(query) {
  if (Array.isArray(query)) {
    this.query.user.concat(query);
  } else {
    this.query.user.push(query);
  }
  return this;
};

/**
 * Filter by token id.
 *
 * @param {string|Array.<string>} query The query.
 * @return {self} Chainable.
 */
Metrics.prototype.token = function(query) {
  if (Array.isArray(query)) {
    this.query.token.concat(query);
  } else {
    this.query.token.push(query);
  }

  return this;
};

/**
 * Filter by date, from.
 *
 * @param {string|Date} query The query.
 * @return {self} Chainable.
 */
Metrics.prototype.from = function(query) {
  if (query instanceof Date) {
    this.query.from = query;
  } else {
    this.query.from = new Date(query);
  }

  return this;
};

/**
 * Filter by date, to.
 *
 * @param {string|Date} query The query.
 * @return {self} Chainable.
 */
Metrics.prototype.to = function(query) {
  if (query instanceof Date) {
    this.query.to = query;
  } else {
    this.query.to = new Date(query);
  }

  return this;
};

