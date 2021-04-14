const pending = '-';
const passing = '✓';
const failed = '❌';

//no circular JSON props for tests
const testProps = [
  'optional', 'type',
  'title', 'body',
  'async', 'sync',
  '_timeout', '_slow',
  '_retries', 'timedOut',
  '_currentRetry', 'pending',
  'file', 'parent',
  'ctx', '_events',
  '_eventsCount', 'callback',
  'timer', 'duration',
  'state', 'speed',
  'fullTitle', 'errors',
  'matrix', 'table'
];

module.exports = {
  pending,
  passing,
  failed,
  testProps
};
