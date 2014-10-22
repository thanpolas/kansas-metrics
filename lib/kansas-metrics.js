/**
 * @fileOverview The main Kansas Metrics module.
 */
// var __ = require('lodash');
var Promise = require('bluebird');
var appErr = require('nodeon-error');

var setup = require('./setup');

/**
 * The Kansas Metrics main module.
 *
 * @constructor
 */
var Metrics = module.exports = function() {
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

  /** @type {Promise.Defer} The instance's master defer */
  this.defer = Promise.defer();

  /** @type {Promise} The instance's master Promise. */
  this.promise = this.defer.promise;

  /** @type {boolean} Indicates a query is taking place */
  this.fetched = false;

  /** @type {string} Get the db keys prefix from Kansas */
  this.prefix = this.kansas._options.prefix;

  // Promisify Redis required methods
  this.smembers = Promise.promisify(this.client.smembers, this.client);

  /** @type {Object} Internal query object */
  this.query = {
    user: [],
    token: [],
    from: null,
    to: null,
  };

  // Augment the Promise object with this method
  for (var key in this) {
    if (this.promise[key]) {
      throw new appErr.Error('Key already defined in promise:', key);
    }
    this.promise[key] = this[key];
  }

  return this.promise;
};

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
  console.log('USER:', this.query);
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

