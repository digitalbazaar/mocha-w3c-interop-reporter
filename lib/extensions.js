/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import {atRisk} from './utils.js';

/**
 * Extensions are functions that extend test data reports.
 * Extensions maybe toggled off or on.
 */
export const extensions = {
  templateData: {
    addAtRisk({templateData}) {
      if(templateData.matrices.length) {
        const atRiskRows = getAtRisk({matrices: templateData.matrices});
        if(atRiskRows.length) {
          const atRiskMatrix = {
            title: 'At Risk',
            rowLabel: 'Statement',
            columnLabel: 'Reason',
            columns: ['At least 2 passing implementations'],
            rows: atRiskRows
          };
          templateData.matrices.push(atRiskMatrix);
        }
      }
    }
  }
};

function getAtRisk({matrices}) {
  const riskRows = [];
  for(const {rows, title} of matrices) {
    // do not include interop results in at risk
    if(title.includes('(interop)')) {
      continue;
    }
    for(const row of rows) {
      // if all tests were skipped then don't add it to at risk
      if(row?.cells.every(cell => cell.state === 'pending')) {
        continue;
      }
      // only include at risk rows
      if(atRisk(row?.cells)) {
        // do not include duplicate statements
        if(!riskRows.some(r => r.id === row.id)) {
          const riskRow = {...row};
          riskRow.cells = [{state: 'failed'}];
          riskRows.push(riskRow);
        }
      }
    }
  }
  return riskRows;
}
