/**
 * @fileOverview Nukes and populates the test db.
 */
var Kansas = require('kansas');
var Promise = require('bluebird');
var kansas = new Kansas({
  prefix: 'kansas-metrics-test',
});

var log = kansas.logger.getLogger('kansas-metrics.test.initdb');

/**
 * Nukes and populates the test db.
 *
 * @constructor
 */
var Initdb = module.exports = function () {
  /** @type {Redis} Redis client */
  this.redis = kansas.conn;
};

/**
 * Start the nuking and population process.
 *
 * @return {Promise} A promise.
 */
Initdb.prototype.start = Promise.method(function() {
  log.fine('start() :: Init...');

  return this.nuke()
    .bind(this)
    .then(this.populateUsage);
});

/**
 * Nuke the keys created.
 *
 * @return {Promise} A promise.
 */
Initdb.prototype.nuke = function() {
  return kansas.db.nuke('Yes purge all records irreversably', 'kansas-metrics-test');
};

Initdb.prototype.populateUsage = function() {

};

