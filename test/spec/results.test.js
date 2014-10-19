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

  describe('Filtering by date', function () {
    describe('using "from"', function () {
      it('should query using "from"', function () {
        return kansasMetrics()
          .from('05-01-2014')
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(12);
            resultAssert.runAllArray(results);
          });
      });
      it('should query using "from" with a day over "01"', function () {
        return kansasMetrics()
          .from('05-23-2014')
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(12);
            resultAssert.runAllArray(results);
          });
      });
      it('should query using "from" with a js Date', function () {
        var dt = new Date('05-23-2014');
        return kansasMetrics()
          .from(dt)
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(12);
            resultAssert.runAllArray(results);
          });
      });
    });
    describe('using "to"', function () {
      it('should query using "to"', function () {
        return kansasMetrics()
          .to('05-01-2014')
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(15);
            resultAssert.runAllArray(results);
          });
      });
      it('should query using "to" with a day over "01"', function () {
        return kansasMetrics()
          .to('05-23-2014')
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(15);
            resultAssert.runAllArray(results);
          });
      });
      it('should query using "to" with a js Date', function () {
        var dt = new Date('05-23-2014');
        return kansasMetrics()
          .to(dt)
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(15);
            resultAssert.runAllArray(results);
          });
      });
    });
    describe('using "from" AND "to"', function () {
      it('should query using "from" AND "to"', function () {
        return kansasMetrics()
          .from('03-01-2014')
          .to('05-01-2014')
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(9);
            resultAssert.runAllArray(results);
          });
      });
      it('should query using "from" and "to" with a day over "01"', function () {
        return kansasMetrics()
          .from('03-24-2014')
          .to('05-23-2014')
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(9);
            resultAssert.runAllArray(results);
          });
      });
      it('should query using "from" AND "to" with a js Date', function () {
        var dtFrom = new Date('03-23-2014');
        var dtTo = new Date('05-23-2014');
        return kansasMetrics()
          .from(dtFrom)
          .to(dtTo)
          .fetch()
          .then(function(results) {
            expect(results).to.have.length(9);
            resultAssert.runAllArray(results);
          });
      });
    });
  });

  describe('Mixing queries', function () {
    it('should fetch expected results', function () {
      return kansasMetrics()
        .from('05-01-2014')
        .user(tester.OWNER_ONE)
        .token(this.kansasInitdb.tokenItem.token)
        .fetch(function(results) {
          expect(results).to.have.length(4);
          resultAssert.runAllArray(results);
        });
    });
    it('should fetch no results', function () {
      return kansasMetrics()
        .from('05-01-2014')
        .user(tester.OWNER_TWO)
        .token(this.kansasInitdb.tokenItem.token)
        .fetch(function(results) {
          expect(results).to.have.length(0);
        });
    });
  });
});
