/**
 * @fileOverview Unit test the date range methods.
 */

var chai = require('chai');
var expect = chai.expect;

// the module to test
var Fetch = require('../../lib/fetch');

describe('Date Range Methods', function () {
  it('should produce expected date ranges', function () {
    var fetch = new Fetch();
    fetch.query = {
      from: new Date('2014-05-12'),
      to: new Date('2015-03-22'),
    };

    var range = fetch._prepareDateKeys();
    expect(range).to.have.length(11);
    expect(range).to.deep.equal([
      '2014-05-01',
      '2014-06-01',
      '2014-07-01',
      '2014-08-01',
      '2014-09-01',
      '2014-10-01',
      '2014-11-01',
      '2014-12-01',
      '2015-01-01',
      '2015-02-01',
      '2015-03-01',
    ]);
  });
});
