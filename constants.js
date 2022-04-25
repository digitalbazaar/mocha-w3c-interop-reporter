const pending = '🛑';
const passing = '✓';
const failing = '❌';
const accessDenied = '⊘';
const timeout = '⏱';
const notImplemented = '—';

const statusMarks = {
  pending,
  passing,
  failing,
  accessDenied,
  timeout,
  notImplemented,
  // mocha's test states aren't in present tense
  passed: passing,
  failed: failing,
};

module.exports = {
  statusMarks,
  pending,
  passing,
  failing,
  accessDenied,
  timeout,
  notImplemented
};
