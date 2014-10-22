/**
 * @fileOverview Unit test the date range methods.
 */

var chai = require('chai');
var expect = chai.expect;

// the module to test
var Fetch = require('../../lib/fetch');

describe('Date Range Methods', function () {
  it('should produce expected date ranges with FROM and TO', function () {
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
  it('should produce expected date ranges using only FROM', function () {
    var fetch = new Fetch();
    fetch.query = {
      from: new Date('2013-05-12'),
    };

    var range = fetch._prepareDateKeys();

    var now = new Date();
    var toYear = now.getFullYear();
    var toMonth = now.getMonth();

    var expectedLength = 8; // May to Dec 2013
    var yearDiff = toYear - 2013 - 1;
    if (yearDiff) {
      expectedLength += yearDiff * 12;
    }

    expectedLength += toMonth + 1;

    expect(range).to.have.length(expectedLength);
  });
  it('should produce expected date ranges using only TO', function () {
    var fetch = new Fetch();
    fetch.query = {
      to: new Date('2014-03-22'),
    };

    var range = fetch._prepareDateKeys();
    expect(range).to.have.length(13);
    expect(range).to.deep.equal([
      '2013-03-01',
      '2013-04-01',
      '2013-05-01',
      '2013-06-01',
      '2013-07-01',
      '2013-08-01',
      '2013-09-01',
      '2013-10-01',
      '2013-11-01',
      '2013-12-01',
      '2014-01-01',
      '2014-02-01',
      '2014-03-01',
    ]);
  });
});
