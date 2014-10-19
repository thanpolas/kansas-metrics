/**
 * @fileOverview Nukes and populates the test db.
 */
var Kansas = require('kansas');
var Promise = require('bluebird');

var usageFix = require('../fixtures/usage.fix');

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
  /** @type {?Redis} Redis client */
  this.client = null;
  /** @type {?Function} Promisified version of redis SET */
  this.set = null;

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

  return kansas.connect()
    .bind(this.kansasInitdb)
    .then(this.kansasInitdb.start)
    .bind(this)
    .then(this.populateUsage);
});

/**
 * Populates usage keys by directly writing them to redis.
 *
 * @return {Promise} A promise.
 */
Initdb.prototype.populateUsage = Promise.method(function() {
  log.fine('populateUsage() :: Populating usage keys...');

  var tokenOne = this.kansasInitdb.tokenItem.token;
  var tokenTwo = this.kansasInitdb.tokenItemTwo.token;
  var tokenThree = this.kansasInitdb.tokenItemCount.token;

  /** @type {?Redis} Redis client */
  this.client = kansas.client;
  this.set = Promise.promisify(this.client.set, this.client);

  return this._populateUsageActual(usageFix.oneLimit, tokenOne)
    .then(this._populateUsageActual.bind(this, usageFix.twoLimit, tokenTwo))
    .then(this._populateUsageActual.bind(this, usageFix.threeCount, tokenThree, true));
});

Initdb.prototype._populateUsageActual = Promise.method(function(fix, token, isCount) {


  return Promise.resolve(fix)
    .bind(this)
    .map(function(fixObj) {
    var key = DB_NAME + ':kansas:usage:' + fixObj.date + ':';
    if (isCount) {
      key += 'count:';
    }
    key += token;

    console.log('POP:', key);

    return this.set(key, fixObj.usage);
  }, {concurrency: 5});
});
