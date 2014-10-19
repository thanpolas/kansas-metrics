/*
 * @fileOverview Main testing helper lib.
 */

var Initdb = require('./initdb.lib');

var tester = module.exports = {};

var init = false;

/** @type {Kansas} Expose kansas instance */
tester.kansas = null;

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
      done();
      return;
    }
    init = true;

    var initdb = new Initdb();
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
