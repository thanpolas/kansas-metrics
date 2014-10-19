/**
 * @fileOverview Test the results returned.
 */
var chai = require('chai');
var expect = chai.expect;

var tester = require('../lib/tester.lib');

var kansasMetrics = require('../..');

describe('Results returned', function() {
  tester.init();

  before(function () {
    kansasMetrics.setup(this.kansas);
  });

  it('should fetch all results', function() {
    return kansasMetrics()
      .fetch()
        .then(function(results) {
          expect(results).to.have.length(24);
        });
  });
});
