/**
 * @fileOverview The main Kansas Metrics module.
 */

var Promise = require('bluebird');
var appErr = require('nodeon-error');

var setup = require('./setup');

/**
 * The Kansas Metrics main module.
 *
 * @constructor
 */
var Metrics = module.exports = function() {
  this.kansas = setup.kansas;

  // Check if Kansas is set.
  if (!this.kansas) {
    throw new appErr.Error('No Kansas instance was defined, use "setup()"');
  }

  // Check if Kansas is connected
  if (!this.kansas.connected) {
    throw new appErr.Error('Kansas is not connected to Redis');
  }


};

/**
 * Filter by owner id.
 *
 * @param {string|Array.<string>} query The query.
 * @return {self} Chainable.
 */
Metrics.prototype.user = function(query) {

};

/**
 * Filter by token id.
 *
 * @param {string|Array.<string>} query The query.
 * @return {self} Chainable.
 */
Metrics.prototype.token = function(query) {

};

/**
 * Filter by date, from.
 *
 * @param {string|Date} query The query.
 * @return {self} Chainable.
 */
Metrics.prototype.from = function(query) {

};

/**
 * Filter by date, to.
 *
 * @param {string|Date} query The query.
 * @return {self} Chainable.
 */
Metrics.prototype.to = function(query) {

};

/**
 * Execute the query.
 *
 * @return {Promise} The instance promise.
 */
Metrics.prototype.fetch = function() {

};

