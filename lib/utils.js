/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
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
