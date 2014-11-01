/**
 * @fileOverview Singleton configuration module.
 */
var __ = require('lodash');

/** @type {Object} Configure Kansas Metrics */
var configure = module.exports = {};

/** @type {?Kansas} The kansas instance */
configure.kansas = null;

/** @type {Object} Default options */
configure._options = {
  /** @type {number} How many concurrent operations to hit Redis with */
  concurrency: 10,
};

/**
 * Setup Kansas Metrics.
 *
 * @param {Kansas} kansas A kansas instance.
 */
configure.setup = function(kansas) {
  configure.kansas = kansas;
};

/**
 * Set operational options for KM.
 *
 * @param {Object} opts The options.
 */
configure.options = function(opts) {
  __.assign(configure._options, opts);
};
