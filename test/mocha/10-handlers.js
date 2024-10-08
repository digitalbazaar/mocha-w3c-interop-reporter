/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
import {formatStats} from '../../lib/handlers.js';

const should = chai.should();

describe('Handlers.js', function() {
  it('should format stats with no errors', function() {
    const passes = 10;
    const failures = 0;
    const tests = 10;
    const pending = 0;
    const expectedResult = [
      `Tests passed ${passes}/${tests} 100%`,
      `Tests failed ${failures}/${tests} 0%`,
      `Failures ${failures}`,
      `Tests skipped ${pending}`,
      `Total tests ${tests}`
    ];
    const actualResult = formatStats({
      passes,
      failures,
      tests,
      pending
    });
    should.exist(actualResult);
    actualResult.should.be.an('array');
    actualResult.length.should.equal(expectedResult.length);
    actualResult.should.eql(expectedResult);
  });
  it('should format stats with some errors', function() {
    const passes = 5;
    const failures = 5;
    const tests = 10;
    const pending = 0;
    const expectedResult = [
      `Tests passed ${passes}/${tests} 50%`,
      `Tests failed ${failures}/${tests} 50%`,
      `Failures ${failures}`,
      `Tests skipped ${pending}`,
      `Total tests ${tests}`
    ];
    const actualResult = formatStats({
      passes,
      failures,
      tests,
      pending
    });
    should.exist(actualResult);
    actualResult.should.be.an('array');
    actualResult.length.should.equal(expectedResult.length);
    actualResult.should.eql(expectedResult);
  });
  it('should format stats with all errors', function() {
    const passes = 0;
    const failures = 10;
    const tests = 10;
    const pending = 0;
    const expectedResult = [
      `Tests passed ${passes}/${tests} 0%`,
      `Tests failed ${failures}/${tests} 100%`,
      `Failures ${failures}`,
      `Tests skipped ${pending}`,
      `Total tests ${tests}`
    ];
    const actualResult = formatStats({
      passes,
      failures,
      tests,
      pending
    });
    should.exist(actualResult);
    actualResult.should.be.an('array');
    actualResult.length.should.equal(expectedResult.length);
    actualResult.should.eql(expectedResult);
  });
  it('should format stats with long decimal places', function() {
    const passes = 1;
    const failures = 2;
    const tests = 3;
    const pending = 0;
    const expectedResult = [
      `Tests passed ${passes}/${tests} 34%`,
      `Tests failed ${failures}/${tests} 66%`,
      `Failures ${failures}`,
      `Tests skipped ${pending}`,
      `Total tests ${tests}`
    ];
    const actualResult = formatStats({
      passes,
      failures,
      tests,
      pending
    });
    should.exist(actualResult);
    actualResult.should.be.an('array');
    actualResult.length.should.equal(expectedResult.length);
    actualResult.should.eql(expectedResult);
  });
  it('should format stats with high precision', function() {
    const passes = 999;
    const failures = 1;
    const tests = 1000;
    const pending = 0;
    const expectedResult = [
      `Tests passed ${passes}/${tests} 99%`,
      `Tests failed ${failures}/${tests} 1%`,
      `Failures ${failures}`,
      `Tests skipped ${pending}`,
      `Total tests ${tests}`
    ];
    const actualResult = formatStats({
      passes,
      failures,
      tests,
      pending
    });
    should.exist(actualResult);
    actualResult.should.be.an('array');
    actualResult.length.should.equal(expectedResult.length);
    actualResult.should.eql(expectedResult);
  });
});
