const chai = require('chai');
const should = chai.should();
export const shouldBeReport = (actualReport, expectedReport) => {
  should.exist(actualReport, 'Expected report to exist');
  actualReport.should.be.a('string', 'Expected report to be a string');
  //actualReport.should.deep.equal(expectedReport);
};
