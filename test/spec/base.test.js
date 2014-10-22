/**
 * @fileOverview Base API Surface tests.
 */
var Promise = require('bluebird');
var chai = require('chai');
var expect = chai.expect;
var kansas = require('kansas');

var tester = require('../lib/tester.lib');

var kansasMetrics = require('../..');


describe('Base API Surface', function() {
  tester.init();

  it('should have expected exposed methods', function() {
    expect(kansasMetrics).to.be.a('function');
    expect(kansasMetrics.setup).to.be.a('function');
  });
  it('should throw an error if no Kansas is defined', function() {
    expect(kansasMetrics).to.throw(Error);
    expect(kansasMetrics).to.throw(/No Kansas instance was defined/);
  });
  it('should throw an error if Kansas is not connected', function() {
    kansasMetrics.setup(kansas);
    expect(kansasMetrics).to.throw(Error);
    expect(kansasMetrics).to.throw(/Kansas is not connected to Redis/);
  });

  it('should return a Bluebird Promise when invoked', function() {
    kansasMetrics.setup(this.kansas);
    var queryObj = kansasMetrics();
    expect(queryObj.then).to.be.a('function');
    expect(queryObj.catch).to.be.a('function');
    expect(queryObj.bind).to.be.a('function');
  });
  it('should have expected methods when invoked', function() {
    kansasMetrics.setup(this.kansas);
    var queryObj = kansasMetrics();
    expect(queryObj).to.be.an('object');
    expect(queryObj.user).to.be.a('function');
    expect(queryObj.token).to.be.a('function');
    expect(queryObj.from).to.be.a('function');
    expect(queryObj.to).to.be.a('function');
    expect(queryObj.fetch).to.be.a('function');
  });
});
