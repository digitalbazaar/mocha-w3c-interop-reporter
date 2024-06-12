/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
export const pending = '🚫';
export const passing = '✓';
export const failing = '❌';
export const accessDenied = '⊘';
export const timeout = '⏱';
export const notImplemented = '—';

export const statusMarks = {
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

export const statusMarkLabels = {
  pending: {icon: pending, label: 'Pending'},
  passed: {icon: passing, label: 'Passed'},
  failed: {icon: failing, label: 'Failed'},
  accessDenied: {icon: accessDenied, label: 'Access Denied'},
  timeout: {icon: timeout, label: 'Timeout'},
  notImplemented: {icon: notImplemented, label: 'Not Implemented'}
};
