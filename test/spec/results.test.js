/**
 * @fileOverview Test the results returned.
 */
var chai = require('chai');
var expect = chai.expect;

var tester = require('../lib/tester.lib');
var resultAssert = require('../asserts/result.assert');

var kansasMetrics = require('../..');

describe('Results returned', function() {
  tester.init();

  before(function () {
    kansasMetrics.setup(this.kansas);
  });

  describe('Fetching all results', function () {
    it('should fetch corrent number of results', function() {
      return kansasMetrics()
        .fetch()
          .then(function(results) {
            expect(results).to.have.length(24);
          });
    });
    it('should fetch results that pass all asserts', function() {
      return kansasMetrics()
        .fetch()
          .then(function(results) {
            resultAssert.runAllArray(results);
          });
    });
  });

  describe('Filtering by user', function () {
    it('should query by user', function () {
      return kansasMetrics()
        .user(tester.OWNER_ONE)
        .fetch()
          .then(function(results) {
            expect(results).to.have.length(16);
            resultAssert.runAllArray(results);
          });
    });
    it('should only fetch specific user results', function () {
      return kansasMetrics()
        .user(tester.OWNER_ONE)
        .fetch()
          .then(function(results) {
            results.forEach(function(result) {
              expect(result.ownerId).to.equal(tester.OWNER_ONE);
            });
          });
    });
    it('should allow multiple user chaning', function () {
      return kansasMetrics()
        .user(tester.OWNER_ONE)
        .user(tester.OWNER_TWO)
        .fetch()
          .then(function(results) {
            expect(results).to.have.length(24);
            resultAssert.runAllArray(results);
          });
    });
    it('should allow single user input with array', function () {
      return kansasMetrics()
        .user([tester.OWNER_ONE, tester.OWNER_TWO])
        .fetch()
          .then(function(results) {
            expect(results).to.have.length(24);
            resultAssert.runAllArray(results);
          });
    });
  });

  describe('Filtering by token', function () {
    it('should query by token', function () {
      return kansasMetrics()
        .token(this.kansasInitdb.tokenItem.token)
        .fetch()
          .then(function(results) {
            expect(results).to.have.length(8);
            resultAssert.runAllArray(results);
          });
    });
    it('should only fetch specific token results', function () {
      return kansasMetrics()
        .token(this.kansasInitdb.tokenItem.token)
        .fetch()
          .bind(this)
          .then(function(results) {
            results.forEach(function(result) {
              expect(result.token).to.equal(this.kansasInitdb.tokenItem.token);
            });
          });
    });
    it('should allow multiple token chaning', function () {
      return kansasMetrics()
        .token(this.kansasInitdb.tokenItem.token)
        .token(this.kansasInitdb.tokenItemCount.token)
        .fetch()
          .then(function(results) {
            expect(results).to.have.length(16);
            resultAssert.runAllArray(results);
          });
    });
    it('should allow single token input with array', function () {
      return kansasMetrics()
        .token([this.kansasInitdb.tokenItem.token,
          this.kansasInitdb.tokenItemCount.token])
        .fetch()
          .then(function(results) {
            expect(results).to.have.length(16);
            resultAssert.runAllArray(results);
          });
    });
  });
});
