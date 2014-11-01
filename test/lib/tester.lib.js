/*
 * @fileOverview Main testing helper lib.
 */
var Promise = require('bluebird');
Promise.longStackTraces();

var Initdb = require('./initdb.lib');

var tester = module.exports = {};

var init = false;

/** @type {Kansas} Expose kansas instance */
tester.kansas = null;

/** @type {app.test.Initdb} Expose initdb instance */
tester.initdb = null;

/** @type {Kansas.Initdb} Expose Kansas initdb instance */
tester.kansasInitdb = null;

/** @const {string} Owner unique id of kansas generated tokens */
tester.OWNER_ONE = 'hip';
/** @const {string} Owner unique id of kansas generated tokens */
tester.OWNER_TWO = 'hop';

/**
 * Boot Test facilities.
 *
 */
tester.init = function() {
  beforeEach(function(done) {
    if (init) {
      this.kansas = tester.kansas;
      this.initdb = tester.initdb;
      this.kansasInitdb = tester.kansasInitdb;
      done();
      return;
    }
    init = true;

    var initdb = tester.initdb = this.initdb = new Initdb();
    this.kansasInitdb = tester.kansasInitdb = initdb.kansasInitdb;

    initdb.start()
      .bind(this)
      .then(function() {
        tester.kansas = initdb.kansas;
        this.kansas = tester.kansas;
      })
      .then(done, done);
  });
};

/**
 * Have a Cooldown period between tests.
 *
 * @param {number} seconds cooldown in seconds.
 * @return {Function} use is beforeEach().
 */
tester.cooldown = function(seconds) {
  return function(done) {
    setTimeout(done, seconds);
  };
};

/** @type {RegExp} Test an ISO8601 type date */
tester.reIso8601 = /^(\d{4})(-(\d{2}))??(-(\d{2}))??(T(\d{2}):(\d{2})(:(\d{2}))??(\.(\d+))??(([+-]{1}\d{2}:\d{2})|Z)??)??$/;

