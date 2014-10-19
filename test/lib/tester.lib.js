/*
 * @fileOverview Main testing helper lib.
 */

var Initdb = require('./initdb.lib');

var tester = module.exports = {};

var init = false;

/**
 * Boot Test facilities.
 *
 */
tester.init = function() {
  beforeEach(function(done) {
    if (init) {
      done();
      return;
    }
    init = true;

    var initdb = new Initdb();
    initdb.start()
      .return(null)
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
