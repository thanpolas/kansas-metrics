/*
 * Kansas Metrics
 * Metrics library for Kansas.
 * https://github.com/thanpolas/kansas-metrics
 *
 * Copyright (c) 2014 Thanasis Polychronakis
 * Licensed under the MIT license.
 *
 * @fileOverview Kansas Metrics Base.
 */
var appErr = require('nodeon-error');

appErr.setName('kansasMetrics');

var setup = require('./setup');
var KansasMetrics = require('./kansas-metrics');

/**
 * The Kansas Metrics exported function.
 *
 * @return {KansasMetrics} An instance of Kansas Metrics.
 */
var metrics = module.exports = function() {
  return new KansasMetrics();
};
/** @type {Function} Expose the Setup method. */
metrics.setup = setup;
