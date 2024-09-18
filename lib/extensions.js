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
            columns: ['More than 2 passing implementations'],
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
  for(const {rows} of matrices) {
    for(const row of rows) {
      // only include at risk rows
      if(atRisk(row?.cells)) {
        // do not include duplicate statements
        if(!riskRows.find(r => r.id === row.id)) {
          const riskRow = {...row};
          riskRow.cells = [{state: 'failed'}];
          riskRows.push(riskRow);
        }
      }
    }
  }
  return riskRows;
}
