/**
 * @fileOverview Base API Surface tests.
 */
var Promise = require('bluebird');
var chai = require('chai');
var expect = chai.expect;

var tester = require('../lib/tester.lib');

var kansasMetrics = require('../..');


describe('Base API Surface', function() {
  tester.init();
  it('should have expected exposed methods', function() {
    expect(kansasMetrics).to.be.a('function');
    expect(kansasMetrics.setup).to.be.a('function');
  });
  it('should return a Bluebird Promise when invoked', function() {
    expect(kansasMetrics()).to.be.instanceof(Promise);
  });
  it('should have expected methods when invoked', function() {
    var queryObj = kansasMetrics();
    expect(queryObj).to.be.an('object');
    expect(queryObj.user).to.be.a('function');
    expect(queryObj.token).to.be.a('function');
    expect(queryObj.from).to.be.a('function');
    expect(queryObj.to).to.be.a('function');
    expect(queryObj.fetch).to.be.a('function');
  });
});
