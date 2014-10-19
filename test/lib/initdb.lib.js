/**
 * @fileOverview Nukes and populates the test db.
 */
var Kansas = require('kansas');
var Promise = require('bluebird');

/** @const {string} The db prefix name */
var DB_NAME = 'kansas-metrics-test';

var kansas = new Kansas({
  prefix: DB_NAME,
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

  this.kansasInitdb = new Kansas.Initdb();
  this.kansasInitdb.dbName = DB_NAME;
};

/**
 * Start the nuking and population process.
 *
 * @return {Promise} A promise.
 */
Initdb.prototype.start = Promise.method(function() {
  log.fine('start() :: Init...');

  return this.kansasInitdb.start()
    .bind(this)
    .then(this.nuke)
    .then(this.populateUsage);
});

/**
 * Nuke the keys created.
 *
 * @return {Promise} A promise.
 */
Initdb.prototype.nuke = function() {
};

Initdb.prototype.populateUsage = function() {

};

