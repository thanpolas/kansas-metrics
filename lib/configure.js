/**
 * @fileOverview Singleton configuration module.
 */

/**
 * Configure Kansas Metrics.
 *
 * @param {Kansas} kansas A kansas instance.
 */
var setup = module.exports = function(kansas) {
  setup.kansas = kansas;
};

/** @type {?Kansas} The kansas instance */
setup.kansas = null;
