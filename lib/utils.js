/*!
 * Copyright (c) 2021-2024 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Creates white spaces.
 *
 * @param {number} many - How many white spaces?
 *
 * @returns {string} A string contains white spaces.
*/
export const spaces = many => new Array(many).join(' ');

/**
 * Counts how many parents a test or suite has.
 *
 * @param {object} test - A mocha test or suite.
 * @param {number} [count=0] - The number of parents counted.
 *
 * @returns {number|Function} Returns a number when it's done
 *   else it returns itself.
*/
export const parents = (test, count = 0) => {
  if(!test.parent) {
    return count;
  }
  return parents(test.parent, ++count);
};

// use the Australian Datetime by default as it
// conforms to the W3C's standards for publish dates in specs.
export const UTCDateTime = (lang = 'en-AU') => {
  return new Intl.DateTimeFormat(lang, {
    timeZone: 'UTC',
    timeZoneName: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

// at risk statements have less than 2 conforming implementations
export const atRisk = cells => !(cells.filter(
  c => c.state === 'passed').length >= 2);

